-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR NOT NULL,
    "name" VARCHAR,
    "img" VARCHAR,
    "updated_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" SERIAL NOT NULL,
    "channel_name" VARCHAR,
    "total_unread" INTEGER DEFAULT 0,
    "last_message" TEXT,
    "last_message_at" TIMESTAMP(6),

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "channel_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("channel_id","account_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" BIGSERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "account_address" VARCHAR,
    "message_type" VARCHAR NOT NULL,
    "tx_hash" TEXT,
    "token_value" DECIMAL(10,0) NOT NULL DEFAULT 0,
    "nft_token_id" VARCHAR,
    "nft_token_img" VARCHAR,
    "message" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readers" (
    "channel_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "message_id" BIGINT NOT NULL,

    CONSTRAINT "readers_pkey" PRIMARY KEY ("channel_id","account_id","message_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER,
    "message_type" VARCHAR,
    "tx_hash" TEXT,
    "tx_receipts" TEXT,
    "tx_result" TEXT,
    "status" VARCHAR DEFAULT '"request"',
    "img_url" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "readers" ADD CONSTRAINT "members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "readers" ADD CONSTRAINT "members_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "readers" ADD CONSTRAINT "members_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

