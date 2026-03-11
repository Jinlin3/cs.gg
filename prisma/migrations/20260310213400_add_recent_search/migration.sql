-- CreateTable
CREATE TABLE "RecentSearch" (
    "id" TEXT NOT NULL,
    "searcherId" TEXT NOT NULL,
    "searchedId" TEXT NOT NULL,
    "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecentSearch_searcherId_searchedId_key" ON "RecentSearch"("searcherId", "searchedId");

-- AddForeignKey
ALTER TABLE "RecentSearch" ADD CONSTRAINT "RecentSearch_searcherId_fkey" FOREIGN KEY ("searcherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentSearch" ADD CONSTRAINT "RecentSearch_searchedId_fkey" FOREIGN KEY ("searchedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
