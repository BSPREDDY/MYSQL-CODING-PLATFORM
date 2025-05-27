// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import { BarChart3, BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";
// import { getCurrentUser } from "@/app/actions/user";
// import {
// 	getUserSubmissions,
// 	getUserSolvedProblems,
// 	getUserContestParticipation,
// } from "@/app/actions/admin";

// export default function UserDashboard() {
// 	const [user, setUser] = useState<any>(null);
// 	const [stats, setStats] = useState({
// 		totalSubmissions: 0,
// 		acceptedSubmissions: 0,
// 		solvedProblems: 0,
// 		totalContests: 0,
// 	});
// 	const [recentSubmissions, setRecentSubmissions] = useState([]);
// 	const [recentContests, setRecentContests] = useState([]);
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		async function fetchUserData() {
// 			try {
// 				setIsLoading(true);

// 				// Fetch user data
// 				const userResult = await getCurrentUser();
// 				if (userResult.success && userResult.user) {
// 					setUser(userResult.user);

// 					// Fetch user statistics
// 					const userId = userResult.user.id;

// 					// Fetch submissions
// 					const submissionsResult = await getUserSubmissions(userId);
// 					const submissions = submissionsResult.success
// 						? submissionsResult.data || []
// 						: [];

// 					// Fetch solved problems
// 					const solvedProblemsResult = await getUserSolvedProblems(userId);
// 					const solvedProblems = solvedProblemsResult.success
// 						? solvedProblemsResult.data
// 						: 0;

// 					// Fetch contests
// 					const contestsResult = await getUserContestParticipation(userId);
// 					const contests = contestsResult.success
// 						? contestsResult.data || []
// 						: [];

// 					// Update stats
// 					setStats({
// 						totalSubmissions: submissions.length,
// 						acceptedSubmissions: submissions.filter(
// 							(sub: any) => sub.status === "AC"
// 						).length,
// 						solvedProblems,
// 						totalContests: contests.length,
// 					});

// 					// Set recent submissions and contests
// 					setRecentSubmissions(submissions.slice(0, 5));
// 					setRecentContests(contests.slice(0, 5));
// 				}
// 			} catch (error) {
// 				console.error("Error fetching user data:", error);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		}

// 		fetchUserData();
// 	}, []);

// 	if (isLoading) {
// 		return (
// 			<div className="flex items-center justify-center h-96">
// 				<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
// 			</div>
// 		);
// 	}

// 	if (!user) {
// 		return (
// 			<div className="flex flex-col items-center justify-center h-96 space-y-4">
// 				<h2 className="text-2xl font-bold">
// 					Please log in to view your dashboard
// 				</h2>
// 				<Link href="/api/login">
// 					<Button>Log In</Button>
// 				</Link>
// 			</div>
// 		);
// 	}

// 	const acceptanceRate =
// 		stats.totalSubmissions > 0
// 			? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
// 			: 0;

// 	return (
// 		<div className="container mx-auto py-6 space-y-8">
// 			<div className="flex flex-col md:flex-row gap-6">
// 				{/* User Profile Card */}
// 				<Card className="md:w-1/3">
// 					<CardHeader className="pb-2">
// 						<CardTitle>My Profile</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="flex flex-col items-center space-y-4">
// 							<Avatar className="h-24 w-24">
// 								<AvatarFallback className="text-2xl bg-primary/10 text-primary">
// 									{getInitials(user.name)}
// 								</AvatarFallback>
// 							</Avatar>
// 							<div className="text-center">
// 								<h2 className="text-xl font-bold">{user.name}</h2>
// 								<p className="text-muted-foreground">{user.email}</p>
// 								<Badge className="mt-2">{user.role}</Badge>
// 							</div>
// 						</div>
// 					</CardContent>
// 				</Card>

// 				{/* Stats Overview */}
// 				<Card className="md:w-2/3">
// 					<CardHeader className="pb-2">
// 						<CardTitle>Performance Overview</CardTitle>
// 						<CardDescription>
// 							Your SQL problem-solving statistics
// 						</CardDescription>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// 							<div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
// 								<BookOpen className="h-8 w-8 text-primary mb-2" />
// 								<span className="text-2xl font-bold">
// 									{stats.solvedProblems}
// 								</span>
// 								<span className="text-sm text-muted-foreground">
// 									Problems Solved
// 								</span>
// 							</div>

// 							<div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
// 								<CheckCircle className="h-8 w-8 text-green-500 mb-2" />
// 								<span className="text-2xl font-bold">{acceptanceRate}%</span>
// 								<span className="text-sm text-muted-foreground">
// 									Acceptance Rate
// 								</span>
// 							</div>

// 							<div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
// 								<Trophy className="h-8 w-8 text-amber-500 mb-2" />
// 								<span className="text-2xl font-bold">
// 									{stats.totalContests}
// 								</span>
// 								<span className="text-sm text-muted-foreground">
// 									Contests Joined
// 								</span>
// 							</div>

// 							<div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
// 								<BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
// 								<span className="text-2xl font-bold">
// 									{stats.totalSubmissions}
// 								</span>
// 								<span className="text-sm text-muted-foreground">
// 									Total Submissions
// 								</span>
// 							</div>
// 						</div>
// 					</CardContent>
// 				</Card>
// 			</div>

// 			<Tabs defaultValue="activity" className="w-full">
// 				<TabsList>
// 					<TabsTrigger value="activity">Recent Activity</TabsTrigger>
// 					<TabsTrigger value="problems">My Problems</TabsTrigger>
// 					<TabsTrigger value="contests">My Contests</TabsTrigger>
// 				</TabsList>

// 				<TabsContent value="activity" className="space-y-4 mt-6">
// 					<div className="grid md:grid-cols-2 gap-6">
// 						<Card>
// 							<CardHeader>
// 								<CardTitle>Recent Submissions</CardTitle>
// 								<CardDescription>
// 									Your latest problem submissions
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								{recentSubmissions.length > 0 ? (
// 									<div className="space-y-4">
// 										{recentSubmissions.map((submission: any, index) => (
// 											<div
// 												key={index}
// 												className="flex items-center justify-between border-b pb-2 last:border-0"
// 											>
// 												<div>
// 													<Link
// 														href={`/problems/${submission.problemId}`}
// 														className="font-medium hover:underline"
// 													>
// 														{submission.problemTitle || "Unknown Problem"}
// 													</Link>
// 													<div className="text-sm text-muted-foreground">
// 														{new Date(
// 															submission.createdAt
// 														).toLocaleDateString()}
// 													</div>
// 												</div>
// 												<Badge
// 													variant={
// 														submission.status === "AC"
// 															? "default"
// 															: "destructive"
// 													}
// 												>
// 													{submission.status === "AC" ? "Accepted" : "Failed"}
// 												</Badge>
// 											</div>
// 										))}
// 									</div>
// 								) : (
// 									<div className="text-center py-6 text-muted-foreground">
// 										No submissions yet. Start solving problems!
// 									</div>
// 								)}

// 								<div className="mt-4">
// 									<Link href="/problems">
// 										<Button variant="outline" className="w-full">
// 											View All Problems
// 										</Button>
// 									</Link>
// 								</div>
// 							</CardContent>
// 						</Card>

// 						<Card>
// 							<CardHeader>
// 								<CardTitle>Contest Participation</CardTitle>
// 								<CardDescription>Your recent contest activity</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								{recentContests.length > 0 ? (
// 									<div className="space-y-4">
// 										{recentContests.map((contest: any, index) => (
// 											<div
// 												key={index}
// 												className="flex items-center justify-between border-b pb-2 last:border-0"
// 											>
// 												<div>
// 													<Link
// 														href={`/contest/${contest.contestId}`}
// 														className="font-medium hover:underline"
// 													>
// 														{contest.contestTitle || "Unknown Contest"}
// 													</Link>
// 													<div className="text-sm text-muted-foreground">
// 														{new Date(contest.updatedAt).toLocaleDateString()}
// 													</div>
// 												</div>
// 												<div className="text-sm font-medium">
// 													{contest.pointsEarned} points
// 												</div>
// 											</div>
// 										))}
// 									</div>
// 								) : (
// 									<div className="text-center py-6 text-muted-foreground">
// 										No contest participation yet. Join a contest!
// 									</div>
// 								)}

// 								<div className="mt-4">
// 									<Link href="/contest">
// 										<Button variant="outline" className="w-full">
// 											View All Contests
// 										</Button>
// 									</Link>
// 								</div>
// 							</CardContent>
// 						</Card>
// 					</div>
// 				</TabsContent>

// 				<TabsContent value="problems" className="space-y-4 mt-6">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>My Problem Progress</CardTitle>
// 							<CardDescription>
// 								Track your problem-solving journey
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent>
// 							<div className="space-y-6">
// 								<div className="space-y-2">
// 									<div className="flex justify-between">
// 										<span className="text-sm font-medium">Problems Solved</span>
// 										<span className="text-sm text-muted-foreground">
// 											{stats.solvedProblems} / 100
// 										</span>
// 									</div>
// 									<Progress
// 										value={stats.solvedProblems}
// 										max={100}
// 										className="h-2"
// 									/>
// 								</div>

// 								<div className="grid grid-cols-3 gap-4 text-center">
// 									<div className="p-4 border rounded-lg">
// 										<div className="text-lg font-bold text-green-500">
// 											{
// 												recentSubmissions.filter(
// 													(sub: any) =>
// 														sub.problemDifficulty === "easy" &&
// 														sub.status === "AC"
// 												).length
// 											}
// 										</div>
// 										<div className="text-sm text-muted-foreground">Easy</div>
// 									</div>

// 									<div className="p-4 border rounded-lg">
// 										<div className="text-lg font-bold text-yellow-500">
// 											{
// 												recentSubmissions.filter(
// 													(sub: any) =>
// 														sub.problemDifficulty === "medium" &&
// 														sub.status === "AC"
// 												).length
// 											}
// 										</div>
// 										<div className="text-sm text-muted-foreground">Medium</div>
// 									</div>

// 									<div className="p-4 border rounded-lg">
// 										<div className="text-lg font-bold text-red-500">
// 											{
// 												recentSubmissions.filter(
// 													(sub: any) =>
// 														sub.problemDifficulty === "hard" &&
// 														sub.status === "AC"
// 												).length
// 											}
// 										</div>
// 										<div className="text-sm text-muted-foreground">Hard</div>
// 									</div>
// 								</div>

// 								<div className="mt-4">
// 									<Link href="/problems">
// 										<Button className="w-full">Practice More Problems</Button>
// 									</Link>
// 								</div>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</TabsContent>

// 				<TabsContent value="contests" className="space-y-4 mt-6">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>My Contest History</CardTitle>
// 							<CardDescription>
// 								Your performance in SQL contests
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent>
// 							{recentContests.length > 0 ? (
// 								<div className="space-y-6">
// 									{recentContests.map((contest: any, index) => (
// 										<div key={index} className="border rounded-lg p-4">
// 											<div className="flex justify-between items-center mb-2">
// 												<h3 className="font-medium">{contest.contestTitle}</h3>
// 												<Badge>{contest.pointsEarned} points</Badge>
// 											</div>
// 											<div className="text-sm text-muted-foreground mb-2">
// 												{new Date(contest.startTime).toLocaleDateString()} -{" "}
// 												{new Date(contest.endTime).toLocaleDateString()}
// 											</div>
// 											<div className="flex items-center text-sm">
// 												<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
// 												<span>
// 													{formatTimeRange(
// 														new Date(contest.startTime),
// 														new Date(contest.endTime)
// 													)}
// 												</span>
// 											</div>
// 										</div>
// 									))}

// 									<div className="mt-4">
// 										<Link href="/user/contests">
// 											<Button variant="outline" className="w-full">
// 												View All Contest History
// 											</Button>
// 										</Link>
// 									</div>
// 								</div>
// 							) : (
// 								<div className="text-center py-10">
// 									<Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
// 									<h3 className="text-lg font-medium mb-2">
// 										No Contest History
// 									</h3>
// 									<p className="text-muted-foreground mb-6">
// 										You haven't participated in any contests yet.
// 									</p>
// 									<Link href="/contest">
// 										<Button>Browse Available Contests</Button>
// 									</Link>
// 								</div>
// 							)}
// 						</CardContent>
// 					</Card>
// 				</TabsContent>
// 			</Tabs>
// 		</div>
// 	);
// }

// function getInitials(name: string): string {
// 	return name
// 		.split(" ")
// 		.map((part) => part[0])
// 		.join("")
// 		.toUpperCase()
// 		.substring(0, 2);
// }

// function formatTimeRange(start: Date, end: Date): string {
// 	const durationMs = end.getTime() - start.getTime();
// 	const hours = Math.floor(durationMs / (1000 * 60 * 60));
// 	const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

// 	return `${hours}h ${minutes}m duration`;
// }


// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import { PasswordChangeForm } from "@/components/PasswordChangeForm"
// import { getCurrentUser } from "@/app/actions/user"
// import type { UserData } from "@/app/actions/user"
// import { Skeleton } from "@/components/ui/skeleton"
// import { UserCircle, Mail, ShieldCheck, Calendar } from "lucide-react"

// export default function UserProfilePage() {
//   const [user, setUser] = useState<UserData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         setLoading(true)
//         const result = await getCurrentUser()

//         if (result.success && result.user) {
//           setUser(result.user)
//         } else {
//           setError(result.error || "Failed to load user data")
//         }
//       } catch (err) {
//         console.error("Error fetching user data:", err)
//         setError("An unexpected error occurred")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserData()
//   }, [])

//   // Function to get initials from name
//   const getInitials = (name: string): string => {
//     return name
//       .split(" ")
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2)
//   }

//   // Format date for display
//   const formatDate = (date: Date): string => {
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }).format(date)
//   }

//   if (loading) {
//     return <ProfileSkeleton />
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-10">
//         <Card className="border-red-200 bg-red-50">
//           <CardContent className="pt-6">
//             <div className="text-center text-red-500">
//               <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
//               <p>{error}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="container mx-auto py-10">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="text-center">
//               <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
//               <p className="text-muted-foreground">Please log in to view your profile</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//           My Profile
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* User Info Card */}
//           <Card className="md:col-span-1 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//             <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
//               <CardTitle className="text-xl text-center">User Information</CardTitle>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="flex flex-col items-center space-y-4">
//                 <Avatar className="h-24 w-24 border-2 border-blue-200 shadow-sm">
//                   <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
//                     {user.name ? getInitials(user.name) : "U"}
//                   </AvatarFallback>
//                 </Avatar>

//                 <h2 className="text-2xl font-bold text-center">{user.name}</h2>

//                 <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
//                   {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                 </Badge>

//                 <Separator className="my-2" />

//                 <div className="w-full space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <Mail className="h-5 w-5 text-blue-500" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Email</p>
//                       <p className="font-medium">{user.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3">
//                     <UserCircle className="h-5 w-5 text-blue-500" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">User ID</p>
//                       <p className="font-medium">{user.userId}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3">
//                     <ShieldCheck className="h-5 w-5 text-blue-500" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Account Type</p>
//                       <p className="font-medium">{user.role === "admin" ? "Administrator" : "Regular User"}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3">
//                     <Calendar className="h-5 w-5 text-blue-500" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Joined</p>
//                       <p className="font-medium">{formatDate(new Date())}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Settings Card */}
//           <Card className="md:col-span-2 border border-gray-200 shadow-md">
//             <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
//               <CardTitle className="text-xl">Account Settings</CardTitle>
//               <CardDescription>Manage your account settings and change your password</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <Tabs defaultValue="password" className="w-full">
//                 <TabsList className="grid w-full grid-cols-1 mb-6">
//                   <TabsTrigger
//                     value="password"
//                     className="text-sm pointer-events-none cursor-default"
//                   >
//                     Change Password
//                   </TabsTrigger>
//                 </TabsList>


//                 <TabsContent value="password" className="space-y-4">
//                   <div className="space-y-2 mb-6">
//                     <h3 className="text-lg font-medium">Password Settings</h3>
//                     <p className="text-sm text-muted-foreground">
//                       Update your password to keep your account secure. We recommend using a strong, unique password.
//                     </p>
//                   </div>

//                   <PasswordChangeForm />
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// function ProfileSkeleton() {
//   return (
//     <div className="container mx-auto py-10 px-4">
//       <div className="max-w-5xl mx-auto">
//         <Skeleton className="h-10 w-48 mb-6" />

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-1">
//             <Skeleton className="h-[500px] w-full rounded-lg" />
//           </div>

//           <div className="md:col-span-2">
//             <Skeleton className="h-[500px] w-full rounded-lg" />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { PasswordChangeForm } from "@/components/PasswordChangeForm"
import { getCurrentUser } from "@/app/actions/user"
import type { UserData } from "@/app/actions/user"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Calendar, BookOpen, GraduationCap } from "lucide-react"
import { UserNavbar } from "@/components/UserNavbar"

export default function UserProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        const result = await getCurrentUser()

        if (result.success && result.user) {
          setUser(result.user)
        } else {
          setError(result.error || "Failed to load user data")
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <UserNavbar />
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <UserNavbar />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
              <p className="text-muted-foreground">Please log in to view your profile</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // // Mock data for register number and section
  // const registerNumber = "SQL2023001"
  // const section = "Advanced SQL"

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card className="md:col-span-1 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4 bg-gray-50 rounded-t-lg">
                <CardTitle className="text-xl text-center text-black">User Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24 border-2 border-gray-200 shadow-sm">
                    <AvatarFallback className="bg-black text-white text-2xl">
                      {user.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-2xl font-bold text-center text-black">{user.name}</h2>

                  <Badge variant="outline" className="px-3 py-1 bg-gray-50 text-black border-gray-200">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>

                  <Separator className="my-2" />

                  <div className="w-full space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-black">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Register Number</p>
                        <p className="font-medium text-black">{user.regNo}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Section</p>
                        <p className="font-medium text-black">{user.section}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="font-medium text-black">{formatDate(new Date())}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="md:col-span-2 border border-gray-200 shadow-md">
              <CardHeader className="pb-4 bg-gray-50 rounded-t-lg">
                <CardTitle className="text-xl text-black">Account Settings</CardTitle>
                <CardDescription>Manage your account settings and change your password</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="password" className="w-full">
<TabsList className="grid w-full grid-cols-1 mb-6">
  <TabsTrigger
    value="password"
    className="text-sm pointer-events-none cursor-default"
  >
    Change Password
  </TabsTrigger>
</TabsList>


                  <TabsContent value="password" className="space-y-4">
                    <div className="space-y-2 mb-6">
                      <h3 className="text-lg font-medium text-black">Password Settings</h3>
                      <p className="text-sm text-gray-500">
                        Update your password to keep your account secure. We recommend using a strong, unique password.
                      </p>
                    </div>

                    <PasswordChangeForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <UserNavbar />
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>

          <div className="md:col-span-2">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
