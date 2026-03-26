import { ChatController } from "@/controllers/chat/chat.controller";
import { authMiddleware, chatController } from "@/controllers/resolvers/resolvers";
import { validateRequest } from "@/middleware/validationRequest";
import { Role } from "@/models/enums/enum";
import { createConversationSchema } from "@/validations/chat/chat.validations";
import { Router } from "express";

const router = Router();


router.post("/conversation",authMiddleware.auntenticate,authMiddleware.allowRoles(Role.User,Role.Vendor),authMiddleware.checkBlocked,validateRequest(createConversationSchema),chatController.createOrGetConversation.bind(chatController))

router.get(
  "/conversations",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User, Role.Vendor),
  authMiddleware.checkBlocked,
  chatController.getConversation.bind(chatController)
);

router.get(
  "/:conversationId",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User, Role.Vendor),
  authMiddleware.checkBlocked,
  chatController.getConversationDetails.bind(chatController)
);

router.get(
  "/:conversationId/messages",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User, Role.Vendor),
  authMiddleware.checkBlocked,
  chatController.getMessages.bind(chatController)
);

export default router;