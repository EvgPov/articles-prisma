-- CreateTable
CREATE TABLE "authors" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- Copy rows from Users Table to Authors table
INSERT INTO "authors" ("id", "username", "first_name", "last_name")
SELECT "id", "username", "first_name", "last_name"
FROM "users";


-- Articles Table
-- Add author_id without NOT NULL in Articles Table
ALTER TABLE "articles" ADD COLUMN "author_id" INTEGER;

-- Fill author_id from user_id in Articles Table
UPDATE "articles" SET "author_id" = "user_id";

-- Add NOT NULL for author_id in Articles Table
ALTER TABLE "articles" ALTER COLUMN "author_id" SET NOT NULL;


-- Comments Table
-- Add author_id without NOT NULL in Comments Table
ALTER TABLE "comments" ADD COLUMN "author_id" INTEGER;

-- Fill author_id from user_id in Comments Table
UPDATE "comments" SET "author_id" = "user_id";

-- Add NOT NULL for author_id in Comments Table
ALTER TABLE "comments" ALTER COLUMN "author_id" SET NOT NULL;



-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "articles"("author_id");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
