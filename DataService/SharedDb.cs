using System.Collections.Concurrent;
using Lab2.Models;

namespace Lab2.DataService;

public class SharedDb
{
    private readonly ConcurrentDictionary<string, UserConnection> _connections = new ConcurrentDictionary<string, UserConnection>();
    
    public ConcurrentDictionary<string, UserConnection> connections => _connections;
}