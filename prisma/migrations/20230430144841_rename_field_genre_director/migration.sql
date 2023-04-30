/*
  Warnings:

  - You are about to drop the column `directors` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `movies` table. All the data in the column will be lost.
  - Added the required column `director` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "directors",
DROP COLUMN "genres",
ADD COLUMN     "director" TEXT NOT NULL,
ADD COLUMN     "genre" TEXT NOT NULL;
