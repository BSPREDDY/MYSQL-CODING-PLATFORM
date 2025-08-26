"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Crown, Search, Lock, CheckCircle, Clock, Star } from "lucide-react"
import { toast } from "sonner"
import { usePremium } from "@/contexts/PremiumContext"

interface PremiumProblem {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  type: "free" | "premium"
  isPremium: boolean
  premiumDescription: string | null
  category: {
    id: string
    name: string
    description: string | null
    icon: string | null
    color: string | null
  } | null
  hasAccess: boolean
  isCompleted: boolean
  createdAt: string
}

interface PremiumCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  sortOrder: number
  problemCount: number
}

export default function UserPremiumProblemsPage() {
  const [problems, setProblems] = useState<PremiumProblem[]>([])
  const [categories, setCategories] = useState<PremiumCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  const { isPremium, isLoading: premiumLoading } = usePremium()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [problemsRes, categoriesRes] = await Promise.all([
        fetch("/api/user/premium-problems"),
        fetch("/api/user/premium-categories"),
      ])

      if (problemsRes.ok) {
        const problemsData = await problemsRes.json()
        setProblems(problemsData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load premium problems")
    } finally {
      setLoading(false)
    }
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || problem.category?.id === selectedCategory
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter

    return matchesSearch && matchesCategory && matchesDifficulty
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

  const getCategoryIcon = (iconName: string | null) => {
    switch (iconName) {
      case "database":
        return "🗄️"
      case "chart-bar":
        return "📊"
      case "zap":
        return "⚡"
      case "briefcase":
        return "💼"
      case "user-check":
        return "✅"
      default:
        return "📝"
    }
  }

  if (loading || premiumLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Premium Problems</h1>
          </div>
          <p className="text-muted-foreground">
            Access advanced SQL problems designed to challenge and improve your skills
          </p>
        </div>
        {!isPremium && (
          <Link href="/user/premium">
            <Button>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </Link>
        )}
      </div>

      {/* Premium Status Banner */}
      {!isPremium && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Premium Subscription Required</h3>
                  <p className="text-sm text-yellow-700">
                    Upgrade to premium to access these advanced SQL problems and unlock your full potential.
                  </p>
                </div>
              </div>
              <Link href="/user/premium">
                <Button
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 bg-transparent"
                >
                  View Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Overview */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{getCategoryIcon(category.icon)}</span>
                  {category.name}
                </CardTitle>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{category.problemCount} problems</Badge>
                  {selectedCategory === category.id && <CheckCircle className="h-4 w-4 text-primary" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {getCategoryIcon(category.icon)} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Difficulty" />
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
          <CardTitle>Premium Problems</CardTitle>
          <CardDescription>
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem, index) => (
                <TableRow key={problem.id}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{problem.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {problem.premiumDescription || problem.description.substring(0, 100)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {problem.category && (
                      <div className="flex items-center gap-2">
                        <span>{getCategoryIcon(problem.category.icon)}</span>
                        <span className="text-sm">{problem.category.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {problem.isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Completed</span>
                        </>
                      ) : problem.hasAccess ? (
                        <>
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-blue-600">Available</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Locked</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {problem.hasAccess ? (
                      <Link href={`/problems/${problem.id}`}>
                        <Button size="sm" variant="outline">
                          Solve
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProblems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {problems.length === 0
                ? "No premium problems available yet."
                : "No problems found matching your filters."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              Advanced Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Work with complex real-world datasets and business scenarios that mirror industry challenges.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Expert Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Access detailed explanations and multiple solution approaches from SQL experts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Track your progress through premium problem categories and skill development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
