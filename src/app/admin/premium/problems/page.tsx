// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Switch } from "@/components/ui/switch"
// import { Plus, Edit, Crown, Search } from "lucide-react"
// import { toast } from "sonner"

// interface Problem {
//   id: string
//   title: string
//   description: string
//   difficulty: "easy" | "medium" | "hard"
//   type: "free" | "premium"
//   isPremium: boolean
//   premiumDescription: string | null
//   hidden: boolean
//   createdAt: string
//   updatedAt: string
// }

// interface SubscriptionPlan {
//   id: string
//   name: string
//   description: string | null
//   isActive: boolean
// }

// interface PremiumProblem {
//   id: string
//   problemId: string
//   planId: string
//   isActive: boolean
//   problem: Problem
//   plan: SubscriptionPlan
// }

// export default function AdminPremiumProblemsPage() {
//   const [problems, setProblems] = useState<Problem[]>([])
//   const [premiumProblems, setPremiumProblems] = useState<PremiumProblem[]>([])
//   const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterType, setFilterType] = useState<"all" | "free" | "premium">("all")
//   const [filterDifficulty, setFilterDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")

//   const [assignFormData, setAssignFormData] = useState({
//     problemId: "",
//     planId: "",
//   })

//   const [editFormData, setEditFormData] = useState({
//     type: "free" as "free" | "premium",
//     isPremium: false,
//     premiumDescription: "",
//   })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [problemsRes, premiumProblemsRes, plansRes] = await Promise.all([
//         fetch("/api/admin/problems"),
//         fetch("/api/admin/premium-problems"),
//         fetch("/api/admin/subscription-plans"),
//       ])

//       if (problemsRes.ok) {
//         const problemsData = await problemsRes.json()
//         setProblems(problemsData)
//       }

//       if (premiumProblemsRes.ok) {
//         const premiumData = await premiumProblemsRes.json()
//         setPremiumProblems(premiumData)
//       }

//       if (plansRes.ok) {
//         const plansData = await plansRes.json()
//         setSubscriptionPlans(plansData.filter((plan: SubscriptionPlan) => plan.isActive))
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       toast.error("Failed to fetch data")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAssignProblem = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const response = await fetch("/api/admin/premium-problems", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(assignFormData),
//       })

//       if (response.ok) {
//         toast.success("Problem assigned to plan successfully")
//         setIsAssignDialogOpen(false)
//         setAssignFormData({ problemId: "", planId: "" })
//         fetchData()
//       } else {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to assign problem")
//       }
//     } catch (error) {
//       console.error("Error assigning problem:", error)
//       toast.error(error instanceof Error ? error.message : "Failed to assign problem")
//     }
//   }

//   const handleEditProblem = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!editingProblem) return

//     try {
//       const response = await fetch(`/api/admin/problems/${editingProblem.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editFormData),
//       })

//       if (response.ok) {
//         toast.success("Problem updated successfully")
//         setIsEditDialogOpen(false)
//         setEditingProblem(null)
//         fetchData()
//       } else {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to update problem")
//       }
//     } catch (error) {
//       console.error("Error updating problem:", error)
//       toast.error(error instanceof Error ? error.message : "Failed to update problem")
//     }
//   }

//   const handleRemoveFromPlan = async (premiumProblemId: string) => {
//     try {
//       const response = await fetch(`/api/admin/premium-problems/${premiumProblemId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         toast.success("Problem removed from plan")
//         fetchData()
//       } else {
//         throw new Error("Failed to remove problem from plan")
//       }
//     } catch (error) {
//       console.error("Error removing problem:", error)
//       toast.error("Failed to remove problem from plan")
//     }
//   }

//   const openEditDialog = (problem: Problem) => {
//     setEditingProblem(problem)
//     setEditFormData({
//       type: problem.type,
//       isPremium: problem.isPremium,
//       premiumDescription: problem.premiumDescription || "",
//     })
//     setIsEditDialogOpen(true)
//   }

//   const filteredProblems = problems.filter((problem) => {
//     const matchesSearch =
//       problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       problem.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesType = filterType === "all" || problem.type === filterType
//     const matchesDifficulty = filterDifficulty === "all" || problem.difficulty === filterDifficulty

//     return matchesSearch && matchesType && matchesDifficulty
//   })

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "easy":
//         return "bg-green-100 text-green-800"
//       case "medium":
//         return "bg-yellow-100 text-yellow-800"
//       case "hard":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-64 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Premium Problems Management</h1>
//           <p className="text-muted-foreground">Manage premium problems and their subscription plan assignments</p>
//         </div>
//         <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Assign Problem to Plan
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Assign Problem to Subscription Plan</DialogTitle>
//               <DialogDescription>
//                 Select a problem and subscription plan to create a premium assignment
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleAssignProblem} className="space-y-4">
//               <div>
//                 <Label htmlFor="problemId">Problem</Label>
//                 <Select
//                   value={assignFormData.problemId}
//                   onValueChange={(value) => setAssignFormData({ ...assignFormData, problemId: value })}
//                   required
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a problem" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {problems.map((problem) => (
//                       <SelectItem key={problem.id} value={problem.id}>
//                         {problem.title} ({problem.difficulty})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="planId">Subscription Plan</Label>
//                 <Select
//                   value={assignFormData.planId}
//                   onValueChange={(value) => setAssignFormData({ ...assignFormData, planId: value })}
//                   required
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a subscription plan" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {subscriptionPlans.map((plan) => (
//                       <SelectItem key={plan.id} value={plan.id}>
//                         {plan.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">Assign Problem</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Filters</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-4 items-end">
//             <div className="flex-1">
//               <Label htmlFor="search">Search Problems</Label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="search"
//                   placeholder="Search by title or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="type-filter">Type</Label>
//               <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
//                 <SelectTrigger className="w-32">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="free">Free</SelectItem>
//                   <SelectItem value="premium">Premium</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="difficulty-filter">Difficulty</Label>
//               <Select value={filterDifficulty} onValueChange={(value: any) => setFilterDifficulty(value)}>
//                 <SelectTrigger className="w-32">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Levels</SelectItem>
//                   <SelectItem value="easy">Easy</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="hard">Hard</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Problems Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Problems</CardTitle>
//           <CardDescription>Manage problem types and premium status</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Problem</TableHead>
//                 <TableHead>Difficulty</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Premium Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredProblems.map((problem) => (
//                 <TableRow key={problem.id}>
//                   <TableCell>
//                     <div>
//                       <div className="font-medium">{problem.title}</div>
//                       <div className="text-sm text-muted-foreground line-clamp-2">
//                         {problem.description.substring(0, 100)}...
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={problem.type === "premium" ? "default" : "secondary"}>{problem.type}</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       {problem.isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
//                       <span>{problem.isPremium ? "Premium" : "Standard"}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Button variant="outline" size="sm" onClick={() => openEditDialog(problem)}>
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           {filteredProblems.length === 0 && (
//             <div className="text-center py-8 text-muted-foreground">No problems found matching your filters.</div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Premium Problem Assignments */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Premium Problem Assignments</CardTitle>
//           <CardDescription>Problems currently assigned to subscription plans</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Problem</TableHead>
//                 <TableHead>Subscription Plan</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {premiumProblems.map((premiumProblem) => (
//                 <TableRow key={premiumProblem.id}>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Crown className="h-4 w-4 text-yellow-500" />
//                       <div>
//                         <div className="font-medium">{premiumProblem.problem.title}</div>
//                         <Badge className={getDifficultyColor(premiumProblem.problem.difficulty)}>
//                           {premiumProblem.problem.difficulty}
//                         </Badge>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div>
//                       <div className="font-medium">{premiumProblem.plan.name}</div>
//                       {premiumProblem.plan.description && (
//                         <div className="text-sm text-muted-foreground">{premiumProblem.plan.description}</div>
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={premiumProblem.isActive ? "default" : "secondary"}>
//                       {premiumProblem.isActive ? "Active" : "Inactive"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Button variant="outline" size="sm" onClick={() => handleRemoveFromPlan(premiumProblem.id)}>
//                       Remove
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           {premiumProblems.length === 0 && (
//             <div className="text-center py-8 text-muted-foreground">No premium problem assignments found.</div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Edit Problem Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Problem Settings</DialogTitle>
//             <DialogDescription>Update the premium status and type for this problem</DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleEditProblem} className="space-y-4">
//             <div>
//               <Label htmlFor="type">Problem Type</Label>
//               <Select
//                 value={editFormData.type}
//                 onValueChange={(value: "free" | "premium") => setEditFormData({ ...editFormData, type: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="free">Free</SelectItem>
//                   <SelectItem value="premium">Premium</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center space-x-2">
//               <Switch
//                 id="isPremium"
//                 checked={editFormData.isPremium}
//                 onCheckedChange={(checked) => setEditFormData({ ...editFormData, isPremium: checked })}
//               />
//               <Label htmlFor="isPremium">Premium Problem</Label>
//             </div>

//             {editFormData.isPremium && (
//               <div>
//                 <Label htmlFor="premiumDescription">Premium Description</Label>
//                 <Textarea
//                   id="premiumDescription"
//                   value={editFormData.premiumDescription}
//                   onChange={(e) => setEditFormData({ ...editFormData, premiumDescription: e.target.value })}
//                   placeholder="Additional description for premium features..."
//                   rows={3}
//                 />
//               </div>
//             )}

//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit">Update Problem</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Crown, Search, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Problem {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  type: "free" | "premium"
  isPremium: boolean
  premiumDescription: string | null
  hidden: boolean
  createdAt: string
  updatedAt: string
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  isActive: boolean
  price: number
  currency: string
  interval: string
}

interface PremiumProblem {
  id: string
  problemId: string
  planId: string
  isActive: boolean
  problem: Problem
  plan: SubscriptionPlan
}

export default function AdminPremiumProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [premiumProblems, setPremiumProblems] = useState<PremiumProblem[]>([])
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "free" | "premium">("all")
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")
  const [assignLoading, setAssignLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const [assignFormData, setAssignFormData] = useState({
    problemId: "",
    planId: "",
  })

  const [editFormData, setEditFormData] = useState({
    type: "free" as "free" | "premium",
    isPremium: false,
    premiumDescription: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching admin data...")

      const [problemsRes, premiumProblemsRes, plansRes] = await Promise.all([
        fetch("/api/admin/problems"),
        fetch("/api/admin/premium-problems"),
        fetch("/api/admin/subscription-plans"),
      ])

      console.log("[v0] API responses:", {
        problems: problemsRes.status,
        premiumProblems: premiumProblemsRes.status,
        plans: plansRes.status,
      })

      if (problemsRes.ok) {
        const problemsData = await problemsRes.json()
        console.log("[v0] Problems data:", problemsData.length, "problems")
        setProblems(problemsData)
      } else {
        console.error("[v0] Problems API error:", problemsRes.status)
        toast.error("Failed to fetch problems")
      }

      if (premiumProblemsRes.ok) {
        const premiumData = await premiumProblemsRes.json()
        console.log("[v0] Premium problems data:", premiumData.length, "assignments")
        setPremiumProblems(premiumData)
      } else {
        console.error("[v0] Premium problems API error:", premiumProblemsRes.status)
        toast.error("Failed to fetch premium problem assignments")
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        console.log("[v0] Plans data:", plansData.length, "plans")
        setSubscriptionPlans(plansData)
      } else {
        console.error("[v0] Plans API error:", plansRes.status)
        toast.error("Failed to fetch subscription plans")
      }
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleAssignProblem = async (e: React.FormEvent) => {
    e.preventDefault()
    setAssignLoading(true)

    try {
      console.log("[v0] Assigning problem:", assignFormData)
      const response = await fetch("/api/admin/premium-problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignFormData),
      })

      if (response.ok) {
        toast.success("Problem assigned to plan successfully")
        setIsAssignDialogOpen(false)
        setAssignFormData({ problemId: "", planId: "" })
        fetchData()
      } else {
        const errorData = await response.json()
        console.error("[v0] Assignment error:", errorData)
        throw new Error(errorData.error || "Failed to assign problem")
      }
    } catch (error) {
      console.error("[v0] Error assigning problem:", error)
      toast.error(error instanceof Error ? error.message : "Failed to assign problem")
    } finally {
      setAssignLoading(false)
    }
  }

  const handleEditProblem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProblem) return
    setEditLoading(true)

    try {
      console.log("[v0] Editing problem:", editingProblem.id, editFormData)
      const response = await fetch(`/api/admin/problems/${editingProblem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      })

      if (response.ok) {
        toast.success("Problem updated successfully")
        setIsEditDialogOpen(false)
        setEditingProblem(null)
        fetchData()
      } else {
        const errorData = await response.json()
        console.error("[v0] Edit error:", errorData)
        throw new Error(errorData.error || "Failed to update problem")
      }
    } catch (error) {
      console.error("[v0] Error updating problem:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update problem")
    } finally {
      setEditLoading(false)
    }
  }

  const handleRemoveFromPlan = async (premiumProblemId: string) => {
    try {
      console.log("[v0] Removing premium problem:", premiumProblemId)
      const response = await fetch(`/api/admin/premium-problems/${premiumProblemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Problem removed from plan")
        fetchData()
      } else {
        const errorData = await response.json()
        console.error("[v0] Remove error:", errorData)
        throw new Error(errorData.error || "Failed to remove problem from plan")
      }
    } catch (error) {
      console.error("[v0] Error removing problem:", error)
      toast.error(error instanceof Error ? error.message : "Failed to remove problem from plan")
    }
  }

  const openEditDialog = (problem: Problem) => {
    setEditingProblem(problem)
    setEditFormData({
      type: problem.type,
      isPremium: problem.isPremium,
      premiumDescription: problem.premiumDescription || "",
    })
    setIsEditDialogOpen(true)
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || problem.type === filterType
    const matchesDifficulty = filterDifficulty === "all" || problem.difficulty === filterDifficulty

    return matchesSearch && matchesType && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number, currency: string, interval: string) => {
    const amount = price / 100
    return `$${amount.toFixed(2)}/${interval}`
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading premium problems management...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Premium Problems Management</h1>
          <p className="text-muted-foreground">Manage premium problems and their subscription plan assignments</p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={problems.length === 0 || subscriptionPlans.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Problem to Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Problem to Subscription Plan</DialogTitle>
              <DialogDescription>
                Select a problem and subscription plan to create a premium assignment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAssignProblem} className="space-y-4">
              <div>
                <Label htmlFor="problemId">Problem</Label>
                <Select
                  value={assignFormData.problemId}
                  onValueChange={(value) => setAssignFormData({ ...assignFormData, problemId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a problem" />
                  </SelectTrigger>
                  <SelectContent>
                    {problems.map((problem) => (
                      <SelectItem key={problem.id} value={problem.id}>
                        {problem.title} ({problem.difficulty})
                        {problem.isPremium && <Crown className="h-3 w-3 ml-1 inline text-yellow-500" />}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="planId">Subscription Plan</Label>
                <Select
                  value={assignFormData.planId}
                  onValueChange={(value) => setAssignFormData({ ...assignFormData, planId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subscription plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {formatPrice(plan.price, plan.currency, plan.interval)}
                        {!plan.isActive && " (Inactive)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={assignLoading}>
                  {assignLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Assign Problem
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {problems.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No problems found. Create some problems first before managing premium assignments.
          </AlertDescription>
        </Alert>
      )}

      {subscriptionPlans.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No subscription plans found. Create subscription plans first before assigning premium problems.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search Problems</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty-filter">Difficulty</Label>
              <Select value={filterDifficulty} onValueChange={(value: any) => setFilterDifficulty(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Problems ({problems.length})</CardTitle>
          <CardDescription>Manage problem types and premium status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Premium Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {problem.title}
                        {problem.isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {problem.description.substring(0, 100)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={problem.type === "premium" ? "default" : "secondary"}>{problem.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{problem.isPremium ? "Premium" : "Standard"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(problem)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProblems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No problems found matching your filters.</div>
          )}
        </CardContent>
      </Card>

      {/* Premium Problem Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Premium Problem Assignments ({premiumProblems.length})</CardTitle>
          <CardDescription>Problems currently assigned to subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Subscription Plan</TableHead>
                <TableHead>Plan Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {premiumProblems.map((premiumProblem) => (
                <TableRow key={premiumProblem.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">{premiumProblem.problem.title}</div>
                        <Badge className={getDifficultyColor(premiumProblem.problem.difficulty)}>
                          {premiumProblem.problem.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{premiumProblem.plan.name}</div>
                      {premiumProblem.plan.description && (
                        <div className="text-sm text-muted-foreground">{premiumProblem.plan.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatPrice(
                        premiumProblem.plan.price,
                        premiumProblem.plan.currency,
                        premiumProblem.plan.interval,
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={premiumProblem.isActive ? "default" : "secondary"}>
                      {premiumProblem.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveFromPlan(premiumProblem.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {premiumProblems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No premium problem assignments found. Use the "Assign Problem to Plan" button to create assignments.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Problem Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Problem Settings</DialogTitle>
            <DialogDescription>Update the premium status and type for this problem</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProblem} className="space-y-4">
            <div>
              <Label htmlFor="type">Problem Type</Label>
              <Select
                value={editFormData.type}
                onValueChange={(value: "free" | "premium") => setEditFormData({ ...editFormData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPremium"
                checked={editFormData.isPremium}
                onCheckedChange={(checked) => setEditFormData({ ...editFormData, isPremium: checked })}
              />
              <Label htmlFor="isPremium">Premium Problem</Label>
            </div>

            {editFormData.isPremium && (
              <div>
                <Label htmlFor="premiumDescription">Premium Description</Label>
                <Textarea
                  id="premiumDescription"
                  value={editFormData.premiumDescription}
                  onChange={(e) => setEditFormData({ ...editFormData, premiumDescription: e.target.value })}
                  placeholder="Additional description for premium features..."
                  rows={3}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Problem
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
