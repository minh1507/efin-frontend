"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Lab1() {
    const [isConnected, setIsConnected] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");
    const [leds, setLeds] = useState<{ name: string; status: boolean }[]>([]);
    const [dht, setDht] = useState({
        temperature: 1,
        humidity: 2
    })

    useEffect(() => {
        getStatusWifi();
        fetchLeds();
        if (isConnected) {
            const interval = setInterval(() => {
                fetchDht();
            }, 2000);
    
            return () => clearInterval(interval); // Cleanup interval on unmount or dependency change
        }
    }, [isConnected]);

    async function fetchDht() {
        try {
            const response = await axios.get("http://localhost:4200/api/v1/sts/lab-1/dht");
            const ledData = response.data.data

            setDht(prevUser => ({
                ...prevUser,
                temperature: Number(ledData.temperature),
                humidity: Number(ledData.humidity)
            }));
        } catch (error) {
            console.error("Error fetching LEDs:", error);
        }
    }

    async function fetchLeds() {
        try {
            const response = await axios.get("http://localhost:4200/api/v1/sts/lab-1/get-leds");
            const ledData = response.data.data.map((led: any) => ({
                name: led.name,
                status: led.status,
            }));
            setLeds(ledData);
        } catch (error) {
            console.error("Error fetching LEDs:", error);
        }
    }

    async function getStatusWifi() {
        try {
            const response = await axios.get("http://localhost:4200/api/v1/sts/lab-1/wifi-status");
            setIsConnected(response.data.data.status === "on");
        } catch (error) {
            console.error("Error fetching WiFi status:", error);
        }
    }

    async function disconnect() {
        await axios.post("http://localhost:4200/api/v1/sts/lab-1/reset-wifi");
        setIsConnected(false);
        setIsDialogOpen(false);
    }

    const handleConnect = () => {
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:4200/api/v1/sts/lab-1/set-wifi", {
                password,
                ssid,
                connect: isConnected,
            });
            setIsConnected(true);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error setting WiFi:", error);
        }
    };

    async function toggleSwitch(index: number) {
        if (!isConnected) return;

        const updatedLeds = leds.map((led, i) =>
            i === index ? { ...led, status: !led.status } : led
        );
        setLeds(updatedLeds);

        try {
            await axios.post("http://localhost:4200/api/v1/sts/lab-1/set-leds", {
                leds: updatedLeds.map(led => ({
                    name: led.name,
                    status: led.status ? "on" : "off",
                })),
            });
        } catch (error) {
            console.error("Error setting LED states:", error);
        }
    }


    async function toggleAllSwitches() {
        if (!isConnected) return;

        const allOn = leds.every(led => led.status);
        const newStatus = !allOn;

        setLeds(leds.map(led => ({ ...led, status: newStatus })));

        try {
            await axios.post("http://localhost:4200/api/v1/sts/lab-1/set-leds", {
                leds: leds.map(led => ({ name: led.name, status: newStatus ? "on" : "off" })),
            });
        } catch (error) {
            console.error("Error setting all LEDs:", error);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-3">Connect</h1>
            <div className="flex items-center space-x-4">
                {isConnected ? (
                    <Wifi className="text-green-500 w-6 h-6" />
                ) : (
                    <WifiOff className="text-red-500 w-6 h-6" />
                )}
                <span className="text-lg font-semibold cursor-pointer" onClick={handleConnect}>
                    {isConnected ? "Connected" : "Not Connected"}
                </span>
            </div>

            <Separator className="mt-3" />
            <h1 className="text-4xl font-bold mt-2">Leds</h1>
            <div className={`grid grid-cols-1 gap-4 mt-6 ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}>
                {leds.map((led, index) => (
                    <Card key={index} className="p-4 flex justify-between items-center w-60">
                        <span>{led.name}</span>
                        <Switch checked={led.status} onCheckedChange={() => toggleSwitch(index)} />
                    </Card>
                ))}
            </div>

            <Button onClick={toggleAllSwitches} className="mt-4" disabled={!isConnected}>
                {leds.every(led => led.status) ? "Turn All Off" : "Turn All On"}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isConnected ? "Disconnect or Change Wi-Fi" : "Enter Wi-Fi Credentials"}</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="SSID" value={ssid} onChange={e => setSsid(e.target.value)} className="mb-2" />
                    <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <DialogFooter className="flex justify-between">
                        {isConnected && <Button variant="outline" onClick={disconnect}>Disconnect</Button>}
                        <Button onClick={handleSubmit}>{isConnected ? "Save" : "Connect"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Separator className="mt-3" />
            <h1 className="text-4xl font-bold mt-2">Sensor</h1>
            <Table className="mt-3">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/2">Parameter</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Humidity</TableCell>
                        <TableCell>{dht.humidity}%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Temperature</TableCell>
                        <TableCell>{dht.temperature}°C</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Button onClick={fetchDht} className="mt-4" disabled={!isConnected}>
                Refresh
            </Button>

        </div>
    );
}
