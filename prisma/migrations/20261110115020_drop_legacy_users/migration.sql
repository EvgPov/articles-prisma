/*
  Warnings:

  - You are about to drop the column `user_id` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "users";
