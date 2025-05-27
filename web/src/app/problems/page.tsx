// "use server";

// import { appDb } from "@/db/postgres";
// import { problems } from "@/db/postgres/schema";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";
// import Link from "next/link";

// export default async function ProblemsPage() {
// 	const data = await appDb.select().from(problems);

// 	return (
// 		<div className="min-h-screen bg-[#0a0d16]">
// 			<div className="container mx-auto px-4 py-8">
// 				<div className="rounded-lg overflow-hidden">
// 					<Table>
// 						<TableHeader>
// 							<TableRow className="border-b border-blue-900">
// 								<TableHead className="text-center text-3xl font-semibold text-blue-400 bg-[#0f1524] py-4">
// 									Problems
// 								</TableHead>
// 							</TableRow>
// 						</TableHeader>
// 						<TableBody className="bg-[#0a0d16]">
// 							{data.length > 0 ? (
// 								data.map((problem) => (
// 									<TableRow
// 										key={problem.id}
// 										className="border-b border-blue-900/30 hover:bg-[#0f1524] transition-colors"
// 									>
// 										<TableCell className="p-0 text-xl text-center">
// 											<Link
// 												href={`/problems/${problem.id}`}
// 												className="block px-4 py-3 text-gray-300 hover:text-blue-400 transition-colors"
// 											>
// 												{problem.title}
// 											</Link>
// 										</TableCell>
// 									</TableRow>
// 								))
// 							) : (
// 								<TableRow>
// 									<TableCell className="text-center py-4 text-gray-400">
// 										No problems found.
// 									</TableCell>
// 								</TableRow>
// 							)}
// 						</TableBody>
// 					</Table>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }



// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useSearchParams, useRouter } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
// import { CheckCircle, Search, ArrowUpDown } from "lucide-react"
// import { getProblems } from "@/app/actions/problem-actions"
// import { UserNavbar } from "@/components/UserNavbar"

// export default function ProblemsPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   interface Problem {
//     id: string
//     title: string
//     difficulty: "easy" | "medium" | "hard"
//     solved?: boolean
//     tags?: string[]
//   }

//   const [problems, setProblems] = useState<Problem[]>([])
//   const [totalPages, setTotalPages] = useState(1)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
//   const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "all")
//   const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)

//   const [sortField, setSortField] = useState<string | null>(null)
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

//   useEffect(() => {
//     async function fetchProblems() {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const difficulties = selectedDifficulty && selectedDifficulty !== "all" ? [selectedDifficulty] : []

//         const result = await getProblems({
//           search: searchQuery,
//           page: currentPage,
//           limit: 10,
//           difficulties,
//         })

//         if (result) {
//           // Fix here: normalize tags to array of strings regardless of original shape
//           const filteredProblems =
//             result.problems?.map((problem) => ({
//               ...problem,
//               difficulty: problem.difficulty || "easy",
//               tags: problem.tags
//                 ? problem.tags.map((tag: string | { name: string }) => (typeof tag === "string" ? tag : tag.name))
//                 : [],
//             })) || []

//           setProblems(filteredProblems)
//           setTotalPages(result.totalPages || 1)
//         }
//       } catch (error) {
//         console.error("Error fetching problems:", error)
//         setError("Failed to load problems")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchProblems()
//     const intervalId = setInterval(fetchProblems, 30000)
//     return () => clearInterval(intervalId)
//   }, [searchQuery, selectedDifficulty, currentPage])

//   const sortedProblems = [...problems].sort((a, b) => {
//     if (!sortField) return 0

//     let valueA, valueB

//     switch (sortField) {
//       case "title":
//         valueA = a.title.toLowerCase()
//         valueB = b.title.toLowerCase()
//         break
//       case "difficulty":
//         const difficultyOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3 }
//         valueA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0
//         valueB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0
//         break
//       default:
//         return 0
//     }

//     if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
//     if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
//     return 0
//   })

//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("asc")
//     }
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     setCurrentPage(1)

//     const params = new URLSearchParams()
//     if (searchQuery) params.set("search", searchQuery)
//     if (selectedDifficulty && selectedDifficulty !== "all") params.set("difficulty", selectedDifficulty)

//     router.push(`/problems?${params.toString()}`)
//   }

//   const handleDifficultyChange = (value: string) => {
//     setSelectedDifficulty(value)
//     setCurrentPage(1)

//     const params = new URLSearchParams(searchParams.toString())
//     if (value && value !== "all") {
//       params.set("difficulty", value)
//     } else {
//       params.delete("difficulty")
//     }

//     router.push(`/problems?${params.toString()}`)
//   }

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page)

//     const params = new URLSearchParams(searchParams.toString())
//     params.set("page", page.toString())

//     router.push(`/problems?${params.toString()}`)
//   }

//   return (
//     <div className="min-h-screen bg-gray-700 text-white">
//       <UserNavbar />
//       <div>
//         <Card className="bg-gray-700 text-white shadow-none border-none">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-white">Problems</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
//               <form onSubmit={handleSearch} className="w-full md:flex-1 flex gap-2">
//                 <div className="relative w-full md:w-72">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     type="text"
//                     placeholder="Search problems by title..."
//                     className="pl-9 bg-zinc-800 text-white placeholder:text-gray-400"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <Button type="submit" className="shrink-0">
//                   Search
//                 </Button>
//               </form>

//               <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
//                 <SelectTrigger className="w-48 bg-zinc-800 text-white">
//                   <SelectValue placeholder="All Difficulty" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Difficulties</SelectItem>
//                   <SelectItem value="easy">Easy</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="hard">Hard</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {isLoading ? (
//               <div className="flex justify-center py-16">
//                 <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
//               </div>
//             ) : error ? (
//               <div className="text-center py-8 text-red-500">{error}</div>
//             ) : (
//               <>
//                 <div className="rounded-md overflow-x-auto">
//                   <Table className="border-separate border-spacing-0 w-full">
//                     <TableHeader>
//                       <TableRow className="border-none">
//                         <TableHead className="w-12 text-center text-white px-3 py-2">#</TableHead>
//                         <TableHead className="cursor-pointer text-white px-3 py-2" onClick={() => handleSort("title")}>
//                           <div className="flex items-center font-bold">
//                             Title
//                             {sortField === "title" && (
//                               <ArrowUpDown
//                                 className={`ml-2 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
//                               />
//                             )}
//                           </div>
//                         </TableHead>
//                         <TableHead
//                           className="cursor-pointer text-right text-white px-3 py-2"
//                           onClick={() => handleSort("difficulty")}
//                         >
//                           <div className="flex items-center justify-end font-bold">
//                             Difficulty
//                             {sortField === "difficulty" && (
//                               <ArrowUpDown
//                                 className={`ml-2 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
//                               />
//                             )}
//                           </div>
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {sortedProblems.length > 0 ? (
//                         sortedProblems.map((problem, index) => (
//                           <TableRow
//                             key={problem.id}
//                             className={`border-none transition-colors hover:bg-zinc-800 ${
//                               index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"
//                             }`}
//                           >
//                             <TableCell className="text-center text-white px-3 py-2 font-medium border-none">
//                               {(currentPage - 1) * 10 + index + 1}
//                             </TableCell>
//                             <TableCell className="text-white px-3 py-2 border-none">
//                               <div className="flex items-center gap-2">
//                                 {problem.solved && <CheckCircle className="h-4 w-4 text-green-500" />}
//                                 <Link href={`/problems/${problem.id}`} className="font-medium hover:underline">
//                                   {problem.title}
//                                 </Link>
//                               </div>
//                             </TableCell>
//                             <TableCell className="text-right px-3 py-2 border-none">
//                               <span
//                                 className={`capitalize px-3 py-1 text-white rounded-md text-sm font-semibold ${
//                                   problem.difficulty === "easy"
//                                     ? "bg-green-500"
//                                     : problem.difficulty === "medium"
//                                       ? "bg-yellow-500"
//                                       : "bg-red-500"
//                                 }`}
//                               >
//                                 {problem.difficulty}
//                               </span>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow className="border-none">
//                           <TableCell colSpan={4} className="text-center py-8 text-gray-400 border-none">
//                             No problems found. Try adjusting your search or filters.
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 {totalPages > 1 && (
//                   <div className="mt-6">
//                     <Pagination>
//                       <PaginationContent>
//                         <PaginationItem>
//                           <PaginationPrevious
//                             onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
//                             className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                           />
//                         </PaginationItem>

//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                           <PaginationItem key={page}>
//                             <PaginationLink
//                               onClick={() => handlePageChange(page)}
//                               isActive={currentPage === page}
//                               className="cursor-pointer"
//                             >
//                               {page}
//                             </PaginationLink>
//                           </PaginationItem>
//                         ))}

//                         <PaginationItem>
//                           <PaginationNext
//                             onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
//                             className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                           />
//                         </PaginationItem>
//                       </PaginationContent>
//                     </Pagination>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useSearchParams, useRouter } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
// import { CheckCircle, Search, ArrowUpDown } from "lucide-react"
// import { getProblems } from "@/app/actions/problem-actions"

// export default function ProblemsPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   interface Problem {
//     id: string
//     title: string
//     difficulty: "easy" | "medium" | "hard"
//     solved?: boolean
//     tags?: string[]
//   }

//   const [problems, setProblems] = useState<Problem[]>([])
//   const [totalPages, setTotalPages] = useState(1)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
//   const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "all")
//   const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)

//   const [sortField, setSortField] = useState<string | null>(null)
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

//   useEffect(() => {
//     async function fetchProblems() {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const difficulties = selectedDifficulty && selectedDifficulty !== "all" ? [selectedDifficulty] : []

//         const result = await getProblems({
//           search: searchQuery,
//           page: currentPage,
//           limit: 10,
//           difficulties,
//         })

//         if (result) {
//           // Fix here: normalize tags to array of strings regardless of original shape
//           const filteredProblems =
//             result.problems?.map((problem) => ({
//               ...problem,
//               difficulty: problem.difficulty || "easy",
//               tags: problem.tags
//                 ? problem.tags.map((tag: string | { name: string }) => (typeof tag === "string" ? tag : tag.name))
//                 : [],
//             })) || []

//           setProblems(filteredProblems)
//           setTotalPages(result.totalPages || 1)
//         }
//       } catch (error) {
//         console.error("Error fetching problems:", error)
//         setError("Failed to load problems")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchProblems()
//     const intervalId = setInterval(fetchProblems, 30000)
//     return () => clearInterval(intervalId)
//   }, [searchQuery, selectedDifficulty, currentPage])

//   const sortedProblems = [...problems].sort((a, b) => {
//     if (!sortField) return 0

//     let valueA, valueB

//     switch (sortField) {
//       case "title":
//         valueA = a.title.toLowerCase()
//         valueB = b.title.toLowerCase()
//         break
//       case "difficulty":
//         const difficultyOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3 }
//         valueA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0
//         valueB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0
//         break
//       default:
//         return 0
//     }

//     if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
//     if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
//     return 0
//   })

//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("asc")
//     }
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     setCurrentPage(1)

//     const params = new URLSearchParams()
//     if (searchQuery) params.set("search", searchQuery)
//     if (selectedDifficulty && selectedDifficulty !== "all") params.set("difficulty", selectedDifficulty)

//     router.push(`/problems?${params.toString()}`)
//   }

//   const handleDifficultyChange = (value: string) => {
//     setSelectedDifficulty(value)
//     setCurrentPage(1)

//     const params = new URLSearchParams(searchParams.toString())
//     if (value && value !== "all") {
//       params.set("difficulty", value)
//     } else {
//       params.delete("difficulty")
//     }

//     router.push(`/problems?${params.toString()}`)
//   }

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page)

//     const params = new URLSearchParams(searchParams.toString())
//     params.set("page", page.toString())

//     router.push(`/problems?${params.toString()}`)
//   }

//   return (
//     <div className="min-h-screen bg-gray-700 text-white">
//       <div>
//         <Card className="bg-gray-700 text-white shadow-none border-none">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-white">Problems</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
//               <form onSubmit={handleSearch} className="w-full md:flex-1 flex gap-2">
//                 <div className="relative w-full md:w-72">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     type="text"
//                     placeholder="Search problems by title..."
//                     className="pl-9 bg-zinc-800 text-white placeholder:text-gray-400"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <Button type="submit" className="shrink-0">
//                   Search
//                 </Button>
//               </form>

//               <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
//                 <SelectTrigger className="w-48 bg-zinc-800 text-white">
//                   <SelectValue placeholder="All Difficulty" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Difficulties</SelectItem>
//                   <SelectItem value="easy">Easy</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="hard">Hard</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {isLoading ? (
//               <div className="flex justify-center py-16">
//                 <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
//               </div>
//             ) : error ? (
//               <div className="text-center py-8 text-red-500">{error}</div>
//             ) : (
//               <>
//                 <div className="rounded-md overflow-x-auto">
//                   <Table className="border-separate border-spacing-0 w-full">
//                     <TableHeader>
//                       <TableRow className="border-none">
//                         <TableHead className="w-12 text-center text-white px-3 py-2">#</TableHead>
//                         <TableHead className="cursor-pointer text-white px-3 py-2" onClick={() => handleSort("title")}>
//                           <div className="flex items-center font-bold">
//                             Title
//                             {sortField === "title" && (
//                               <ArrowUpDown
//                                 className={`ml-2 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
//                               />
//                             )}
//                           </div>
//                         </TableHead>
//                         <TableHead
//                           className="cursor-pointer text-right text-white px-3 py-2"
//                           onClick={() => handleSort("difficulty")}
//                         >
//                           <div className="flex items-center justify-end font-bold">
//                             Difficulty
//                             {sortField === "difficulty" && (
//                               <ArrowUpDown
//                                 className={`ml-2 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
//                               />
//                             )}
//                           </div>
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {sortedProblems.length > 0 ? (
//                         sortedProblems.map((problem, index) => (
//                           <TableRow
//                             key={problem.id}
//                             className={`border-none transition-colors hover:bg-zinc-800 ${
//                               index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"
//                             }`}
//                           >
//                             <TableCell className="text-center text-white px-3 py-2 font-medium border-none">
//                               {(currentPage - 1) * 10 + index + 1}
//                             </TableCell>
//                             <TableCell className="text-white px-3 py-2 border-none">
//                               <div className="flex items-center gap-2">
//                                 {problem.solved && <CheckCircle className="h-4 w-4 text-green-500" />}
//                                 <Link href={`/problems/${problem.id}`} className="font-medium hover:underline">
//                                   {problem.title}
//                                 </Link>
//                               </div>
//                             </TableCell>
//                             <TableCell className="text-right px-3 py-2 border-none">
//                               <span
//                                 className={`capitalize px-3 py-1 text-white rounded-md text-sm font-semibold ${
//                                   problem.difficulty === "easy"
//                                     ? "bg-green-500"
//                                     : problem.difficulty === "medium"
//                                       ? "bg-yellow-500"
//                                       : "bg-red-500"
//                                 }`}
//                               >
//                                 {problem.difficulty}
//                               </span>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow className="border-none">
//                           <TableCell colSpan={4} className="text-center py-8 text-gray-400 border-none">
//                             No problems found. Try adjusting your search or filters.
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 {totalPages > 1 && (
//                   <div className="mt-6">
//                     <Pagination>
//                       <PaginationContent>
//                         <PaginationItem>
//                           <PaginationPrevious
//                             onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
//                             className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                           />
//                         </PaginationItem>

//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                           <PaginationItem key={page}>
//                             <PaginationLink
//                               onClick={() => handlePageChange(page)}
//                               isActive={currentPage === page}
//                               className="cursor-pointer"
//                             >
//                               {page}
//                             </PaginationLink>
//                           </PaginationItem>
//                         ))}

//                         <PaginationItem>
//                           <PaginationNext
//                             onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
//                             className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                           />
//                         </PaginationItem>
//                       </PaginationContent>
//                     </Pagination>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CheckCircle, Search, ArrowUpDown } from "lucide-react"
import { getProblems } from "@/app/actions/problem-actions"
import { UserNavbar } from "@/components/UserNavbar"

export default function ProblemsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  interface Problem {
    id: string
    title: string
    difficulty: "easy" | "medium" | "hard"
    solved?: boolean
    tags?: string[]
  }

  const [problems, setProblems] = useState<Problem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "all")
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)

  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    async function fetchProblems() {
      try {
        setIsLoading(true)
        setError(null)

        const difficulties = selectedDifficulty && selectedDifficulty !== "all" ? [selectedDifficulty] : []

        const result = await getProblems({
          search: searchQuery,
          page: currentPage,
          limit: 10,
          difficulties,
        })

        if (result) {
          // Fix here: normalize tags to array of strings regardless of original shape
          const filteredProblems =
            result.problems?.map((problem) => ({
              ...problem,
              difficulty: problem.difficulty || "easy",
              tags: problem.tags
                ? problem.tags.map((tag: string | { name: string }) => (typeof tag === "string" ? tag : tag.name))
                : [],
            })) || []

          setProblems(filteredProblems)
          setTotalPages(result.totalPages || 1)
        }
      } catch (error) {
        console.error("Error fetching problems:", error)
        setError("Failed to load problems")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProblems()
    const intervalId = setInterval(fetchProblems, 30000)
    return () => clearInterval(intervalId)
  }, [searchQuery, selectedDifficulty, currentPage])

  const sortedProblems = [...problems].sort((a, b) => {
    if (!sortField) return 0

    let valueA, valueB

    switch (sortField) {
      case "title":
        valueA = a.title.toLowerCase()
        valueB = b.title.toLowerCase()
        break
      case "difficulty":
        const difficultyOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3 }
        valueA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0
        valueB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0
        break
      default:
        return 0
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)

    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedDifficulty && selectedDifficulty !== "all") params.set("difficulty", selectedDifficulty)

    router.push(`/problems?${params.toString()}`)
  }

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value)
    setCurrentPage(1)

    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("difficulty", value)
    } else {
      params.delete("difficulty")
    }

    router.push(`/problems?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())

    router.push(`/problems?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50">
            <CardTitle className="text-2xl font-bold text-black">Problems</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              <form onSubmit={handleSearch} className="w-full md:flex-1 flex gap-2">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search problems by title..."
                    className="pl-9 bg-white text-black border-gray-200 placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="shrink-0 bg-black text-white hover:bg-gray-800">
                  Search
                </Button>
              </form>

              <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="w-48 bg-white text-black border-gray-200">
                  <SelectValue placeholder="All Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <>
                <div className="rounded-md overflow-x-auto border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12 text-center font-bold text-black">#</TableHead>
                        <TableHead className="cursor-pointer font-bold text-black" onClick={() => handleSort("title")}>
                          <div className="flex items-center">
                            Title
                            {sortField === "title" && (
                              <ArrowUpDown
                                className={`ml-2 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer text-right font-bold text-black"
                          onClick={() => handleSort("difficulty")}
                        >
                          <div className="flex items-center justify-end">
                            Difficulty
                            {sortField === "difficulty" && (
                              <ArrowUpDown
                                className={`ml-2 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                              />
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedProblems.length > 0 ? (
                        sortedProblems.map((problem, index) => (
                          <TableRow
                            key={problem.id}
                            className={`transition-colors hover:bg-gray-50 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <TableCell className="text-center font-medium text-black">
                              {(currentPage - 1) * 10 + index + 1}
                            </TableCell>
                            <TableCell className="text-black">
                              <div className="flex items-center gap-2">
                                {problem.solved && <CheckCircle className="h-4 w-4 text-green-500" />}
                                <Link href={`/problems/${problem.id}`} className="font-medium hover:underline">
                                  {problem.title}
                                </Link>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`capitalize px-3 py-1 text-white rounded-md text-sm font-semibold ${
                                  problem.difficulty === "easy"
                                    ? "bg-black"
                                    : problem.difficulty === "medium"
                                      ? "bg-gray-700"
                                      : "bg-gray-900"
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No problems found. Try adjusting your search or filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className={`cursor-pointer ${currentPage === page ? "bg-black text-white" : ""}`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
