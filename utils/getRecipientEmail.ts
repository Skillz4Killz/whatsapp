export default function getRecipientEmail(
  userEmails: string[],
  currentUserEmail: string
) {
  return userEmails.filter((email) => email !== currentUserEmail)[0];
}
