using Microsoft.AspNetCore.SignalR;
using Lab2.Models;

namespace Lab2.Hubs
{
    public class ChatHub : Hub
    {
        // Dictionary to store room and username for each connection ID
        private static readonly Dictionary<string, string> RoomUsers = new();

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            // Add the connection to the specified group (chat room)
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);

            // Map connection ID to username
            RoomUsers[Context.ConnectionId] = conn.Username;

            await Clients.Group(conn.ChatRoom)
                .SendAsync("ReceiveMessage", "Admin", $"{conn.Username} has joined {conn.ChatRoom}", DateTime.Now.ToString("hh:mm tt"));
            
            // Notify user list update
            await Clients.Group(conn.ChatRoom).SendAsync("UpdateUserList", RoomUsers.Values);
        }

        public async Task SendMessage(string chatroom, string message)
        {
            if (RoomUsers.TryGetValue(Context.ConnectionId, out string username))
            {
                var timestamp = DateTime.Now.ToString("hh:mm tt");
                await Clients.Group(chatroom)
                    .SendAsync("ReceiveMessage", username, message, timestamp);
            }
        }


        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Remove the user from the dictionary and notify the room
            if (RoomUsers.TryGetValue(Context.ConnectionId, out string username))
            {
                RoomUsers.Remove(Context.ConnectionId);
                var chatroom = GetChatRoomByConnectionId(Context.ConnectionId);
                await Clients.Group(chatroom).SendAsync("UpdateUserList", RoomUsers.Values);
                await Clients.Group(chatroom).SendAsync("ReceiveMessage", "Admin", $"{username} has left the chat", DateTime.Now.ToString("hh:mm tt"));
            }

            await base.OnDisconnectedAsync(exception);
        }

        private string GetChatRoomByConnectionId(string connectionId)
        {
            // Get the chat room for the given connection ID
            return RoomUsers.TryGetValue(connectionId, out string username) ? username : string.Empty;
        }

        public async Task UserTyping(string chatRoom, string username)
        {
            await Clients.Group(chatRoom).SendAsync("ShowTyping", username);
        }

        public async Task UserStoppedTyping(string chatRoom, string username)
        {
            await Clients.Group(chatRoom).SendAsync("HideTyping", username);
        }
    }
}
