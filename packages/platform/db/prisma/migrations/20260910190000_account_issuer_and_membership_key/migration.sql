-- Better Auth writes account.issuer on create and the initial migration had no
-- such column, so every registration failed with a PrismaClientValidationError.
--
-- Added in three steps rather than as NOT NULL directly, so the migration is
-- safe on a database that already holds accounts from the initial migration.
-- Credential accounts take "local:<providerId>", which is the value the library
-- itself writes. No OAuth accounts exist yet; if any did, their issuer would be
-- the provider's issuer URL rather than this backfilled value.
ALTER TABLE "account" ADD COLUMN "issuer" TEXT;
UPDATE "account" SET "issuer" = 'local:' || "providerId" WHERE "issuer" IS NULL;
ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;

-- Written internally by the organization plugin when adding a team member.
ALTER TABLE "team_member" ADD COLUMN "membershipKey" TEXT;

CREATE UNIQUE INDEX "account_issuer_accountId_key" ON "account"("issuer", "accountId");
CREATE UNIQUE INDEX "team_member_membershipKey_key" ON "team_member"("membershipKey");
