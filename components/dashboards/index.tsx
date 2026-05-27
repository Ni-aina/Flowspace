"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";

type RecentItem = {
    id: string;
    title: string;
    type: "board" | "flow" | "note";
    updatedAt: string;
    color: string;
}

type Stat = {
    label: string;
    value: string;
    delta: string;
}

const recentItems: RecentItem[] = [
    { id: "1", title: "Product Roadmap", type: "board", updatedAt: "2h ago", color: "#059669" },
    { id: "2", title: "Onboarding Flow", type: "flow", updatedAt: "5h ago", color: "#2563EB" },
    { id: "3", title: "Sprint Planning", type: "board", updatedAt: "1d ago", color: "#DC2626" },
    { id: "4", title: "API Design Notes", type: "note", updatedAt: "2d ago", color: "#D97706" },
    { id: "5", title: "User Research", type: "flow", updatedAt: "3d ago", color: "#7C3AED" }
]

const stats: Stat[] = [
    { label: "Active Boards", value: "12", delta: "+3 this week" },
    { label: "Flows Built", value: "47", delta: "+8 this month" },
    { label: "Collaborators", value: "9", delta: "2 online now" }
]

const typeIcon: Record<RecentItem["type"], string> = {
    board: "▦",
    flow: "⇢",
    note: "◈"
}

const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: "easeOut"
        }
    }
}

const WelcomeDashboard = () => {
    const [greeting, setGreeting] = useState("Good morning")

    useEffect(() => {
        const h = new Date().getHours()
        if (h >= 12 && h < 17) setGreeting("Good afternoon")
        else if (h >= 17) setGreeting("Good evening")
    }, [])

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="min-h-screen w-full bg-[#F7F5F0] text-[#1A1A18] font-mono px-8 py-12 flex flex-col items-center"
        >
            <div className="w-full max-w-2xl">
                <motion.p variants={itemVariants} className="text-xs tracking-[0.22em] uppercase text-[#AAAAA0] mb-16">
                    flowspace
                </motion.p>

                <motion.div variants={itemVariants} className="mb-12">
                    <p className="text-xs tracking-widest text-[#888880] mb-1">{greeting},</p>
                    <h1 className="text-5xl font-serif font-normal tracking-tight text-[#1A1A18] mb-3">
                        Alex Rivera
                    </h1>
                    <p className="text-xs text-[#999990]">
                        You have 3 unresolved threads and 1 pending review.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-px bg-[#E2E0D8] rounded overflow-hidden mb-14">
                    {
                        stats.map((s) =>
                            <div key={s.label} className="bg-[#FDFCF8] px-5 py-6 flex flex-col gap-1.5">
                                <span className="text-4xl font-serif text-[#1A1A18] leading-none">{s.value}</span>
                                <span className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">{s.label}</span>
                                <span className="text-[10px] text-[#059669] mt-1">{s.delta}</span>
                            </div>
                        )
                    }
                </motion.div>

                <motion.p variants={itemVariants} className="text-[10px] tracking-[0.12em] uppercase text-[#AAAAAA] mb-4">
                    Recently visited
                </motion.p>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="border-t border-[#E2E0D8]"
                >
                    {
                        recentItems.map((item) =>
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                className="flex items-center gap-3.5 py-3.5 border-b border-[#E2E0D8] cursor-pointer"
                            >
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                                <span className="text-sm text-[#BBBBBB] w-4 text-center">{typeIcon[item.type]}</span>
                                <span className="flex-1 text-sm text-[#2A2A28] tracking-wide">{item.title}</span>
                                <span className="text-[10px] tracking-widest uppercase text-[#BBBBBB] w-12">{item.type}</span>
                                <span className="text-[10px] text-[#BBBBBB] w-14 text-right">{item.updatedAt}</span>
                            </motion.div>
                        )
                    }
                </motion.div>
            </div>
        </motion.main>
    )
}

export default WelcomeDashboard;