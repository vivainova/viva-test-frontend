"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/app/dashboard/dataTable"
import { useEffect, useState } from "react";
import { Progressbar } from "@/app/dashboard/progressbar"


const Dashboard = () => {
    const router = useRouter();
        const [jwtConfirmed, setJwtConfirmed] = useState(false);
        
    useEffect(() => {
        const jwt = localStorage.getItem('jwtToken');
        if (!jwt) {
            
            const timer = setTimeout(() => {
                router.push("/");
            }, 2000);
            return () => clearTimeout(timer);
        }
        else {
            const timer = setTimeout(() => {
                setJwtConfirmed(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);
    
    return (
        <div className="grid w-full px-20 items-center gap-4">
            {jwtConfirmed ? <DataTable /> : <Progressbar />}
        </div>
    );
}

export default Dashboard;