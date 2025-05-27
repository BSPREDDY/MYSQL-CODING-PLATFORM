// import Link from "next/link";
// import { parseFutureDate, parseOldDate } from "@/lib/time";
// import { PrimaryButton } from "./LinkButton";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// interface ContestCardParams {
// 	title: string;
// 	id: string;
// 	endTime: Date;
// 	startTime: Date;
// }

// export function ContestCard({
// 	title,
// 	id,
// 	startTime,
// 	endTime,
// }: ContestCardParams) {
// 	const duration = `${
// 		(new Date(endTime).getTime() - new Date(startTime).getTime()) /
// 		(1000 * 60 * 60)
// 	} hours`;
// 	const isActive =
// 		startTime.getTime() < Date.now() && endTime.getTime() > Date.now();

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<div className="flex justify-between">
// 					<CardTitle>{title}</CardTitle>
// 					<div>
// 						{startTime.getTime() < Date.now() &&
// 						endTime.getTime() < Date.now() ? (
// 							<div className="text-red-500">Ended</div>
// 						) : null}
// 						{isActive ? <div className="text-green-500">Active</div> : null}
// 						{endTime.getTime() < Date.now() ? (
// 							<div className="text-red-500">Ended</div>
// 						) : null}
// 					</div>
// 				</div>
// 			</CardHeader>
// 			<CardContent>
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">
// 							{startTime.getTime() < Date.now() ? "Started" : "Starts in"}
// 						</p>
// 						<p>
// 							{startTime.getTime() < Date.now()
// 								? parseOldDate(new Date(startTime))
// 								: parseFutureDate(new Date(startTime))}
// 						</p>
// 					</div>
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">Duration</p>
// 						<p>{duration}</p>
// 					</div>
// 				</div>
// 			</CardContent>
// 			<CardFooter>
// 				<PrimaryButton href={`/contest/${id}`}>
// 					{isActive ? "Participate" : "View Contest"}
// 				</PrimaryButton>
// 			</CardFooter>
// 		</Card>
// 	);
// }


// import { parseFutureDate, parseOldDate } from "@/lib/time";
// import { PrimaryButton } from "./LinkButton";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";

// interface ContestCardParams {
// 	title: string;
// 	id: string;
// 	endTime: Date;
// 	startTime: Date;
// }

// export function ContestCard({
// 	title,
// 	id,
// 	startTime,
// 	endTime,
// }: ContestCardParams) {
// 	const duration = `${(
// 		(new Date(endTime).getTime() - new Date(startTime).getTime()) /
// 		(1000 * 60 * 60)
// 	).toFixed(2)} hours`;

// 	const isActive =
// 		startTime.getTime() < Date.now() && endTime.getTime() > Date.now();

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<div className="flex justify-between">
// 					<CardTitle>{title}</CardTitle>
// 					<div>
// 						{startTime.getTime() < Date.now() &&
// 						endTime.getTime() < Date.now() ? (
// 							<div className="text-red-500">Ended</div>
// 						) : null}
// 						{isActive ? <div className="text-green-500">Active</div> : null}
// 						{endTime.getTime() < Date.now() ? (
// 							<div className="text-red-500">Ended</div>
// 						) : null}
// 					</div>
// 				</div>
// 			</CardHeader>
// 			<CardContent>
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">
// 							{startTime.getTime() < Date.now() ? "Started" : "Starts in"}
// 						</p>
// 						<p>
// 							{startTime.getTime() < Date.now()
// 								? parseOldDate(new Date(startTime))
// 								: parseFutureDate(new Date(startTime))}
// 						</p>
// 					</div>
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">Duration</p>
// 						<p>{duration}</p>
// 					</div>
// 				</div>
// 			</CardContent>
// 			<CardFooter>
// 				<PrimaryButton href={`/contest/${id}`}>
// 					{isActive ? "Participate" : "View Contest"}
// 				</PrimaryButton>
// 			</CardFooter>
// 		</Card>
// 	);
// }

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"

interface ContestCardProps {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  participantCount?: number
  isRegistered?: boolean
  isAdmin?: boolean
}

export function ContestCard({
  id,
  title,
  description,
  startTime,
  endTime,
  participantCount = 0,
  isRegistered = false,
  isAdmin = false,
}: ContestCardProps) {
  const [status, setStatus] = useState<"upcoming" | "active" | "ended">("upcoming")
  const [timeLeft, setTimeLeft] = useState<string>("")

  const startDate = new Date(startTime)
  const endDate = new Date(endTime)

  // Calculate duration in hours with 1 decimal place
  const durationHours = ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)).toFixed(1)

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date()

      if (now < startDate) {
        setStatus("upcoming")
        const timeToStart = startDate.getTime() - now.getTime()
        setTimeLeft(formatTimeLeft(timeToStart))
      } else if (now >= startDate && now <= endDate) {
        setStatus("active")
        const timeToEnd = endDate.getTime() - now.getTime()
        setTimeLeft(formatTimeLeft(timeToEnd))
      } else {
        setStatus("ended")
        setTimeLeft("")
      }
    }

    updateStatus()
    const interval = setInterval(updateStatus, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [startTime, endTime])

  const formatTimeLeft = (ms: number): string => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h remaining`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    } else {
      return `${minutes}m remaining`
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-black text-white">Upcoming</Badge>
      case "active":
        return <Badge className="bg-black text-white">Active</Badge>
      case "ended":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-300">
            Ended
          </Badge>
        )
    }
  }

  return (
    <Card className="h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-black">{title}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {startDate.toLocaleDateString()}{" "}
              {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{durationHours} hours</span>
          </div>

          {participantCount > 0 && (
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              <span>{participantCount} participants</span>
            </div>
          )}

          {status !== "ended" && timeLeft && (
            <div className="mt-3">
              <Badge variant="outline" className="bg-gray-50 text-black font-medium">
                {timeLeft}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {status === "ended" ? (
          <Link href={`/contest/${id}`} className="w-full">
            <Button variant="outline" className="w-full border-black text-black hover:bg-gray-100">
              View Results
            </Button>
          </Link>
        ) : isRegistered ? (
          <Link href={`/contest/${id}`} className="w-full">
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              {status === "active" ? "Enter Contest" : "View Contest"}
            </Button>
          </Link>
        ) : (
          <Link href={`/contest/${id}`} className="w-full">
            <Button className="w-full bg-black text-white hover:bg-gray-800">Register Now</Button>
          </Link>
        )}

        {isAdmin && (
          <Link href={`/admin/contests/${id}`} className="ml-2">
            <Button variant="outline" size="icon" className="border-gray-300">
              <span className="sr-only">Edit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pencil"
              >
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
