import { clerkClient } from "@clerk/nextjs";
import UsersDocBoxes from "../models/uses_docboxes";
import { sendEmail } from "../common/mail";

interface UserDocBoxData {
  docBoxId: string;
  userIds: string[];
}

export async function createOrUpdateUserDocBoxService(data: UserDocBoxData) {
  try {
    const users = await clerkClient.users.getUserList();
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      role: user.publicMetadata.role ?? "user",
    }));

    const { docBoxId, userIds } = data;
    console.log("in cccccccccccccccccccc", docBoxId, userIds);

    // Find existing associations for the doc_box_id
    const existingUsersDocBoxes = await UsersDocBoxes.findAll({
      where: { docbox_id: docBoxId },
    });

    // Get the existing user IDs for the doc_box_id
    const existingUserIds = existingUsersDocBoxes.map(
      (userDocBox) => userDocBox.user_id
    );

    // Identify new user IDs to be added
    const newUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId)
    );

    //find out their mails
    const newUserEmails = formattedUsers
      .filter((user) => newUserIds.includes(user.id))
      .map((user) => user.email);

    // Identify existing user IDs to be removed
    const removedUserIds = existingUserIds.filter(
      (userId) => !userIds.includes(userId)
    );

    // Remove associations for the existing user IDs to be removed
    if (removedUserIds.length > 0) {
      await UsersDocBoxes.destroy({
        where: { docbox_id: docBoxId, user_id: removedUserIds },
      });
    }

    // Create associations for the new user IDs to be added
    const newUsersDocBoxes: any = newUserIds.map((userId) => ({
      docbox_id: docBoxId,
      user_id: userId,
    }));
    await UsersDocBoxes.bulkCreate(newUsersDocBoxes);
    await sendEmail({
      userMails: newUserEmails,
      subject: "DocBox Assigned",
      text: `${docBoxId} - DocBox Assigned to you`,
    });
    // Fetch and return the updated associations
    const updatedUsersDocBoxes = await UsersDocBoxes.findAll({
      where: { docbox_id: docBoxId },
    });
    return updatedUsersDocBoxes;
  } catch (error) {
    console.log("errorrrrrrrrrrrrr", error);
  }
}
