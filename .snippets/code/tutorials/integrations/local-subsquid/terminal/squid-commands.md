<div id="termynal" data-termynal>
    <span data-ty>query: CREATE TABLE "migrations" ("id" SERIAL NOT NULL, "timestamp" bigint NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id"))</span>
    <span data-ty>query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC</span>
    <span data-ty>0 migrations are already loaded in the database.</span>
    <span data-ty>1 migrations were found in the source code.</span>
    <span data-ty>1 migrations are new migrations must be executed.</span>
    <span data-ty>query: START TRANSACTION</span>
    <span data-ty>query: CREATE TABLE "transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "tx_hash" text NOT NULL, "amount" numeric NOT NULL, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))</span>
    <span data-ty>query: CREATE INDEX "ID_76bdfed1a7eb27c6d8ecbb7349" ON "transfer" ("from_id")</span>
    <span data-ty>query: CREATE INDEX "IDX_0751309c6697eac9ef1149362" ON "transfer" ("to_id")</span>
    <span data-ty>query: CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5bZea" PRIMARY KEY ("id"))</span>
    <span data-ty>query: ALTER TABLE "transfer" ADD CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION</span>
    <span data-ty>query: ALTER TABLE "transfer" ADD CONSTRAINT "FK_0751309c66e97eac9ef11493623" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION</span>
    <span data-ty>query: INSERT INTO "migrations" ("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1700202953250, "Data1700202953250"]</span>
    <span data-ty>Migration Data1700202953250 has been executed</span>
    <span data-ty>query: COMMIT </span>
    <span data-ty="input"><span class="file-path"></span></span>
</div>