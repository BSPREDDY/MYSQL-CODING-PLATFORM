// import { getContests } from "@/app/actions/contest";
// import { ContestCard } from "./ContestCard";

// export async function Contests() {
// 	const contestsResult = await getContests();

// 	if (!contestsResult.success) {
// 		return (
// 			<div className="min-h-screen p-8">
// 				<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
// 					<h2 className="text-xl font-semibold text-red-700 mb-2">
// 						Error Loading Contests
// 					</h2>
// 					<p className="text-red-600">
// 						{contestsResult.error || "Failed to load contests"}
// 					</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	const allContests = contestsResult.data || [];
// 	const now = new Date();

// 	// Separate contests into upcoming, active, and past
// 	const upcomingContests = allContests.filter(
// 		(contest) => new Date(contest.startTime) > now
// 	);

// 	const activeContests = allContests.filter(
// 		(contest) =>
// 			new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
// 	);

// 	const pastContests = allContests.filter(
// 		(contest) => new Date(contest.endTime) < now
// 	);

// 	return (
// 		<div className="min-h-screen">
// 			{activeContests.length > 0 && (
// 				<section className="bg-white dark:bg-gray-900 py-8 md:py-12">
// 					<div className="container mx-auto px-4 md:px-6">
// 						<div className="mb-6">
// 							<h2 className="text-2xl font-bold mb-2">Active Contests</h2>
// 							<p className="text-gray-500 dark:text-gray-400">
// 								These contests are currently running. Join now!
// 							</p>
// 						</div>
// 						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// 							{activeContests.map((contest) => (
// 								<ContestCard
// 									key={contest.id}
// 									title={contest.title}
// 									id={contest.id}
// 									startTime={new Date(contest.startTime)}
// 									endTime={new Date(contest.endTime)}
// 								/>
// 							))}
// 						</div>
// 					</div>
// 				</section>
// 			)}

// 			<section className="bg-white dark:bg-gray-900 py-8 md:py-12">
// 				<div className="container mx-auto px-4 md:px-6">
// 					<div className="mb-6">
// 						<h2 className="text-2xl font-bold mb-2">Upcoming Contests</h2>
// 						<p className="text-gray-500 dark:text-gray-400">
// 							Check out these upcoming contests.
// 						</p>
// 					</div>
// 					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// 						{upcomingContests.length > 0 ? (
// 							upcomingContests.map((contest) => (
// 								<ContestCard
// 									key={contest.id}
// 									title={contest.title}
// 									id={contest.id}
// 									startTime={new Date(contest.startTime)}
// 									endTime={new Date(contest.endTime)}
// 								/>
// 							))
// 						) : (
// 							<div className="col-span-full text-center py-8 text-gray-500">
// 								No upcoming contests at the moment.
// 							</div>
// 						)}
// 					</div>
// 				</div>
// 			</section>

// 			<section className="bg-white dark:bg-gray-900 py-8 md:py-12">
// 				<div className="container mx-auto px-4 md:px-6">
// 					<div className="mb-6">
// 						<h2 className="text-2xl font-bold mb-2">Previous Contests</h2>
// 						<p className="text-gray-500 dark:text-gray-400">
// 							Browse through our past contests.
// 						</p>
// 					</div>
// 					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// 						{pastContests.length > 0 ? (
// 							pastContests.map((contest) => (
// 								<ContestCard
// 									key={contest.id}
// 									title={contest.title}
// 									id={contest.id}
// 									startTime={new Date(contest.startTime)}
// 									endTime={new Date(contest.endTime)}
// 								/>
// 							))
// 						) : (
// 							<div className="col-span-full text-center py-8 text-gray-500">
// 								No past contests available.
// 							</div>
// 						)}
// 					</div>
// 				</div>
// 			</section>
// 		</div>
// 	);
// }


// import { getContests } from "@/app/actions/contest"
// import { ContestCard } from "./ContestCard"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"

// interface ContestsProps {
//   searchParams?: {
//     activePage?: string
//     upcomingPage?: string
//     pastPage?: string
//   }
// }

// export async function Contests({ searchParams = {} }: ContestsProps) {
//   const activePage = Number(searchParams.activePage) || 1
//   const upcomingPage = Number(searchParams.upcomingPage) || 1
//   const pastPage = Number(searchParams.pastPage) || 1
//   const pageSize = 6

//   const contestsResult = await getContests()

//   if (!contestsResult.success) {
//     return (
//       <div className="min-h-screen p-8">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//           <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Contests</h2>
//           <p className="text-red-600">{contestsResult.error || "Failed to load contests"}</p>
//         </div>
//       </div>
//     )
//   }

//   const allContests = contestsResult.data || []
//   const now = new Date()

//   // Separate contests into upcoming, active, and past
//   const upcomingContests = allContests.filter((contest) => new Date(contest.startTime) > now)
//   const activeContests = allContests.filter(
//     (contest) => new Date(contest.startTime) <= now && new Date(contest.endTime) >= now,
//   )
//   const pastContests = allContests.filter((contest) => new Date(contest.endTime) < now)

//   // Paginate each category
//   const paginateContests = (contests: any[], page: number, size: number) => {
//     const startIndex = (page - 1) * size
//     return contests.slice(startIndex, startIndex + size)
//   }

//   const paginatedActive = paginateContests(activeContests, activePage, pageSize)
//   const paginatedUpcoming = paginateContests(upcomingContests, upcomingPage, pageSize)
//   const paginatedPast = paginateContests(pastContests, pastPage, pageSize)

//   // Calculate total pages for each category
//   const activeTotalPages = Math.ceil(activeContests.length / pageSize)
//   const upcomingTotalPages = Math.ceil(upcomingContests.length / pageSize)
//   const pastTotalPages = Math.ceil(pastContests.length / pageSize)

//   return (
//     <div className="min-h-screen bg-[#0a0d16] text-gray-200">

//       {activeContests.length > 0 && (
//         <section className="py-8 md:py-12">
//           <div className="container mx-auto px-4 md:px-6">
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold mb-2 text-blue-400">Active Contests</h2>
//               <p className="text-gray-400">These contests are currently running. Join now!</p>
//             </div>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {paginatedActive.map((contest) => (
//                 <ContestCard
//                   key={contest.id}
//                   title={contest.title}
//                   id={contest.id}
//                   startTime={new Date(contest.startTime)}
//                   endTime={new Date(contest.endTime)}
//                 />
//               ))}
//             </div>

//             {activeTotalPages > 1 && (
//               <div className="mt-6">
//                 <Pagination>
//                   <PaginationContent>
//                     {activePage > 1 && (
//                       <PaginationItem>
//                         <PaginationPrevious
//                           href={`/user/contests?activePage=${activePage - 1}&upcomingPage=${upcomingPage}&pastPage=${pastPage}`}
//                         />
//                       </PaginationItem>
//                     )}

//                     {Array.from({ length: Math.min(5, activeTotalPages) }, (_, i) => {
//                       let pageNumber = i + 1
//                       if (activeTotalPages > 5) {
//                         if (activePage > 3) {
//                           pageNumber = activePage - 3 + i
//                         }
//                         if (pageNumber > activeTotalPages - 4) {
//                           pageNumber = activeTotalPages - 4 + i
//                         }
//                       }

//                       return (
//                         <PaginationItem key={pageNumber}>
//                           <PaginationLink
//                             href={`/user/contests?activePage=${pageNumber}&upcomingPage=${upcomingPage}&pastPage=${pastPage}`}
//                             isActive={activePage === pageNumber}
//                           >
//                             {pageNumber}
//                           </PaginationLink>
//                         </PaginationItem>
//                       )
//                     })}

//                     {activePage < activeTotalPages && (
//                       <PaginationItem>
//                         <PaginationNext
//                           href={`/user/contests?activePage=${activePage + 1}&upcomingPage=${upcomingPage}&pastPage=${pastPage}`}
//                         />
//                       </PaginationItem>
//                     )}
//                   </PaginationContent>
//                 </Pagination>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       <section className="py-8 md:py-12">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold mb-2 text-blue-400">Upcoming Contests</h2>
//             <p className="text-gray-400">Check out these upcoming contests.</p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {paginatedUpcoming.length > 0 ? (
//               paginatedUpcoming.map((contest) => (
//                 <ContestCard
//                   key={contest.id}
//                   title={contest.title}
//                   id={contest.id}
//                   startTime={new Date(contest.startTime)}
//                   endTime={new Date(contest.endTime)}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-8 text-gray-500">No upcoming contests at the moment.</div>
//             )}
//           </div>

//           {upcomingTotalPages > 1 && (
//             <div className="mt-6">
//               <Pagination>
//                 <PaginationContent>
//                   {upcomingPage > 1 && (
//                     <PaginationItem>
//                       <PaginationPrevious
//                         href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage - 1}&pastPage=${pastPage}`}
//                       />
//                     </PaginationItem>
//                   )}

//                   {Array.from({ length: Math.min(5, upcomingTotalPages) }, (_, i) => {
//                     let pageNumber = i + 1
//                     if (upcomingTotalPages > 5) {
//                       if (upcomingPage > 3) {
//                         pageNumber = upcomingPage - 3 + i
//                       }
//                       if (pageNumber > upcomingTotalPages - 4) {
//                         pageNumber = upcomingTotalPages - 4 + i
//                       }
//                     }

//                     return (
//                       <PaginationItem key={pageNumber}>
//                         <PaginationLink
//                           href={`/user/contests?activePage=${activePage}&upcomingPage=${pageNumber}&pastPage=${pastPage}`}
//                           isActive={upcomingPage === pageNumber}
//                         >
//                           {pageNumber}
//                         </PaginationLink>
//                       </PaginationItem>
//                     )
//                   })}

//                   {upcomingPage < upcomingTotalPages && (
//                     <PaginationItem>
//                       <PaginationNext
//                         href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage + 1}&pastPage=${pastPage}`}
//                       />
//                     </PaginationItem>
//                   )}
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="py-8 md:py-12">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold mb-2 text-blue-400">Previous Contests</h2>
//             <p className="text-gray-400">Browse through our past contests.</p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {paginatedPast.length > 0 ? (
//               paginatedPast.map((contest) => (
//                 <ContestCard
//                   key={contest.id}
//                   title={contest.title}
//                   id={contest.id}
//                   startTime={new Date(contest.startTime)}
//                   endTime={new Date(contest.endTime)}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-8 text-gray-500">No past contests available.</div>
//             )}
//           </div>

//           {pastTotalPages > 1 && (
//             <div className="mt-6">
//               <Pagination>
//                 <PaginationContent>
//                   {pastPage > 1 && (
//                     <PaginationItem>
//                       <PaginationPrevious
//                         href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage}&pastPage=${pastPage - 1}`}
//                       />
//                     </PaginationItem>
//                   )}

//                   {Array.from({ length: Math.min(5, pastTotalPages) }, (_, i) => {
//                     let pageNumber = i + 1
//                     if (pastTotalPages > 5) {
//                       if (pastPage > 3) {
//                         pageNumber = pastPage - 3 + i
//                       }
//                       if (pageNumber > pastTotalPages - 4) {
//                         pageNumber = pastTotalPages - 4 + i
//                       }
//                     }

//                     return (
//                       <PaginationItem key={pageNumber}>
//                         <PaginationLink
//                           href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage}&pastPage=${pageNumber}`}
//                           isActive={pastPage === pageNumber}
//                         >
//                           {pageNumber}
//                         </PaginationLink>
//                       </PaginationItem>
//                     )
//                   })}

//                   {pastPage < pastTotalPages && (
//                     <PaginationItem>
//                       <PaginationNext
//                         href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage}&pastPage=${pastPage + 1}`}
//                       />
//                     </PaginationItem>
//                   )}
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }



import { getContests } from "@/app/actions/contest"
import { ContestCard } from "./ContestCard"
import { UserNavbar } from "./UserNavbar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface ContestsProps {
  searchParams?: {
    activePage?: string
    upcomingPage?: string
    pastPage?: string
  }
}

export async function Contests({ searchParams = {} }: ContestsProps) {
  const activePage = Number(searchParams.activePage) || 1
  const upcomingPage = Number(searchParams.upcomingPage) || 1
  const pastPage = Number(searchParams.pastPage) || 1
  const pageSize = 6

  const contestsResult = await getContests()

  if (!contestsResult.success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0d16] to-[#111827]">
        <UserNavbar />
        <div className="container mx-auto px-6 py-10">
          <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-8 text-center backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-red-400 mb-3">Error Loading Contests</h2>
            <p className="text-red-300">{contestsResult.error || "Failed to load contests"}</p>
          </div>
        </div>
      </div>
    )
  }

  const allContests = contestsResult.data || []
  const now = new Date()

  // Separate contests into upcoming, active, and past
  const upcomingContests = allContests.filter((contest) => new Date(contest.startTime) > now)
  const activeContests = allContests.filter(
    (contest) => new Date(contest.startTime) <= now && new Date(contest.endTime) >= now,
  )
  const pastContests = allContests.filter((contest) => new Date(contest.endTime) < now)

  // Paginate each category
  const paginateContests = (contests: any[], page: number, size: number) => {
    const startIndex = (page - 1) * size
    return contests.slice(startIndex, startIndex + size)
  }

  const paginatedActive = paginateContests(activeContests, activePage, pageSize)
  const paginatedUpcoming = paginateContests(upcomingContests, upcomingPage, pageSize)
  const paginatedPast = paginateContests(pastContests, pastPage, pageSize)

  // Calculate total pages for each category
  const activeTotalPages = Math.ceil(activeContests.length / pageSize)
  const upcomingTotalPages = Math.ceil(upcomingContests.length / pageSize)
  const pastTotalPages = Math.ceil(pastContests.length / pageSize)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0d16] to-[#111827] text-gray-200">
      {/* <UserNavbar /> */}

      {activeContests.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Active Contests
              </h2>
              <p className="text-gray-400 text-lg">These contests are currently running. Join now!</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedActive.map((contest) => (
                <ContestCard
                  key={contest.id}
                  title={contest.title}
                  id={contest.id}
                  startTime={new Date(contest.startTime)}
                  endTime={new Date(contest.endTime)}
                />
              ))}
            </div>

            {activeTotalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination>
                  <PaginationContent className="gap-2">
                    {activePage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href={`/user/contests?activePage=${activePage - 1}&upcomingPage=${upcomingPage}&pastPage=${pastPage}`}
                          className="bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                        />
                      </PaginationItem>
                    )}

                    {Array.from({ length: Math.min(5, activeTotalPages) }, (_, i) => {
                      let pageNumber = i + 1
                      if (activeTotalPages > 5) {
                        if (activePage > 3) {
                          pageNumber = activePage - 3 + i
                        }
                        if (pageNumber > activeTotalPages - 4) {
                          pageNumber = activeTotalPages - 4 + i
                        }
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href={`/user/contests?activePage=${pageNumber}&upcomingPage=${upcomingPage}&pastPage=${pastPage}`}
                            isActive={activePage === pageNumber}
                            className={
                              activePage === pageNumber
                                ? "bg-blue-900/60 text-blue-200 border border-blue-700"
                                : "bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                            }
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    {activePage < activeTotalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href={`/user/contests?activePage=${activePage + 1}&upcomingPage=${upcomingPage}&pastPage=${pastPage}`}
                          className="bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-12 bg-[#0c1120]/50 backdrop-blur-sm border-y border-blue-900/20">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Upcoming Contests
            </h2>
            <p className="text-gray-400 text-lg">Check out these upcoming contests.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedUpcoming.length > 0 ? (
              paginatedUpcoming.map((contest) => (
                <ContestCard
                  key={contest.id}
                  title={contest.title}
                  id={contest.id}
                  startTime={new Date(contest.startTime)}
                  endTime={new Date(contest.endTime)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400 text-lg">
                No upcoming contests at the moment.
              </div>
            )}
          </div>

          {upcomingTotalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent className="gap-2">
                  {upcomingPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage - 1}&pastPage=${pastPage}`}
                        className="bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: Math.min(5, upcomingTotalPages) }, (_, i) => {
                    let pageNumber = i + 1
                    if (upcomingTotalPages > 5) {
                      if (upcomingPage > 3) {
                        pageNumber = upcomingPage - 3 + i
                      }
                      if (pageNumber > upcomingTotalPages - 4) {
                        pageNumber = upcomingTotalPages - 4 + i
                      }
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href={`/user/contests?activePage=${activePage}&upcomingPage=${pageNumber}&pastPage=${pastPage}`}
                          isActive={upcomingPage === pageNumber}
                          className={
                            upcomingPage === pageNumber
                              ? "bg-blue-900/60 text-blue-200 border border-blue-700"
                              : "bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                          }
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {upcomingPage < upcomingTotalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage + 1}&pastPage=${pastPage}`}
                        className="bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Previous Contests
            </h2>
            <p className="text-gray-400 text-lg">Browse through our past contests.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPast.length > 0 ? (
              paginatedPast.map((contest) => (
                <ContestCard
                  key={contest.id}
                  title={contest.title}
                  id={contest.id}
                  startTime={new Date(contest.startTime)}
                  endTime={new Date(contest.endTime)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400 text-lg">No past contests available.</div>
            )}
          </div>

          {pastTotalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent className="gap-2">
                  {pastPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage}&pastPage=${pastPage - 1}`}
                        className="bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: Math.min(5, pastTotalPages) }, (_, i) => {
                    let pageNumber = i + 1
                    if (pastTotalPages > 5) {
                      if (pastPage > 3) {
                        pageNumber = pastPage - 3 + i
                      }
                      if (pageNumber > pastTotalPages - 4) {
                        pageNumber = pastTotalPages - 4 + i
                      }
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage}&pastPage=${pageNumber}`}
                          isActive={pastPage === pageNumber}
                          className={
                            pastPage === pageNumber
                              ? "bg-blue-900/60 text-blue-200 border border-blue-700"
                              : "bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                          }
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {pastPage < pastTotalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={`/user/contests?activePage=${activePage}&upcomingPage=${upcomingPage}&pastPage=${pastPage + 1}`}
                        className="bg-[#1a2235] border border-blue-900/30 hover:bg-blue-900/40 text-gray-300"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
