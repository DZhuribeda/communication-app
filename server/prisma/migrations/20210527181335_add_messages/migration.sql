-- CreateTable
CREATE TABLE "ChannelMember" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "channelId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channelId" INTEGER NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "text" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelMember.channelId_userId_unique" ON "ChannelMember"("channelId", "userId");
