Entu Core Daemon version v0.0.1

Usage:
  entud [options]                     Start Entu Core Daemon

Options:

  -?
       Print this help message and exit

  -version
       Print version and exit

  -conf=<file>
       Specify configuration file (default: bitcoin.conf)

  -daemon
       Run in the background as a daemon and accept commands

Connection options:

  -addnode=<ip>
       Add a node to connect to and attempt to keep the connection open (see
       the `addnode` RPC command help for more info)

  -banscore=<n>
       Threshold for disconnecting misbehaving peers (default: 100)

  -bantime=<n>
       Number of seconds to keep misbehaving peers from reconnecting (default:
       86400)

  -bind=<addr>
       Bind to given address and always listen on it. Use [host]:port notation
       for IPv6

  -connect=<ip>
       Connect only to the specified node(s); -connect=0 disables automatic
       connections (the rules for this peer are the same as for
       -addnode)

  -discover
       Discover own IP addresses (default: 1 when listening and no -externalip
       or -proxy)

  -dns
       Allow DNS lookups for -addnode, -seednode and -connect (default: 1)

  -dnsseed
       Query for peer addresses via DNS lookup, if low on addresses (default: 1
       unless -connect used)

  -externalip=<ip>
       Specify your own public address

  -forcednsseed
       Always query for peer addresses via DNS lookup (default: 0)

  -listen
       Accept connections from outside (default: 1 if no -proxy or -connect)

  -listenonion
       Automatically create Tor hidden service (default: 1)

  -maxconnections=<n>
       Maintain at most <n> connections to peers (default: 125)

  -maxreceivebuffer=<n>
       Maximum per-connection receive buffer, <n>*1000 bytes (default: 5000)

  -maxsendbuffer=<n>
       Maximum per-connection send buffer, <n>*1000 bytes (default: 1000)

  -maxtimeadjustment
       Maximum allowed median peer time offset adjustment. Local perspective of
       time may be influenced by peers forward or backward by this
       amount. (default: 4200 seconds)

  -onion=<ip:port>
       Use separate SOCKS5 proxy to reach peers via Tor hidden services
       (default: -proxy)

  -onlynet=<net>
       Only connect to nodes in network <net> (ipv4, ipv6 or onion)

  -permitbaremultisig
       Relay non-P2SH multisig (default: 1)

  -peerbloomfilters
       Support filtering of blocks and transaction with bloom filters (default:
       1)

  -port=<port>
       Listen for connections on <port> (default: 8333 or testnet: 18333)

  -proxy=<ip:port>
       Connect through SOCKS5 proxy

  -proxyrandomize
       Randomize credentials for every proxy connection. This enables Tor
       stream isolation (default: 1)

  -seednode=<ip>
       Connect to a node to retrieve peer addresses, and disconnect

  -timeout=<n>
       Specify connection timeout in milliseconds (minimum: 1, default: 5000)

  -torcontrol=<ip>:<port>
       Tor control port to use if onion listening enabled (default:
       127.0.0.1:9051)

  -torpassword=<pass>
       Tor control port password (default: empty)

  -upnp
       Use UPnP to map the listening port (default: 0)

  -whitebind=<addr>
       Bind to given address and whitelist peers connecting to it. Use
       [host]:port notation for IPv6

  -whitelist=<IP address or network>
       Whitelist peers connecting from the given IP address (e.g. 1.2.3.4) or
       CIDR notated network (e.g. 1.2.3.0/24). Can be specified multiple
       times. Whitelisted peers cannot be DoS banned and their
       transactions are always relayed, even if they are already in the
       mempool, useful e.g. for a gateway

  -maxuploadtarget=<n>
       Tries to keep outbound traffic under the given target (in MiB per 24h),
       0 = no limit (default: 0)

Wallet options:

  -addresstype
       What type of addresses to use ("legacy", "p2sh-segwit", or "bech32",
       default: "p2sh-segwit")

  -changetype
       What type of change to use ("legacy", "p2sh-segwit", or "bech32").
       Default is same as -addresstype, except when
       -addresstype=p2sh-segwit a native segwit output is used when
       sending to a native segwit address)

  -disablewallet
       Do not load the wallet and disable wallet RPC calls

  -keypool=<n>
       Set key pool size to <n> (default: 1000)

  -fallbackfee=<amt>
       A fee rate (in BTC/kB) that will be used when fee estimation has
       insufficient data (default: 0.0002)

  -discardfee=<amt>
       The fee rate (in BTC/kB) that indicates your tolerance for discarding
       change by adding it to the fee (default: 0.0001). Note: An output
       is discarded if it is dust at this rate, but we will always
       discard up to the dust relay fee and a discard fee above that is
       limited by the fee estimate for the longest target

  -mintxfee=<amt>
       Fees (in BTC/kB) smaller than this are considered zero fee for
       transaction creation (default: 0.00001)

  -paytxfee=<amt>
       Fee (in BTC/kB) to add to transactions you send (default: 0.00)

  -rescan
       Rescan the block chain for missing wallet transactions on startup

  -salvagewallet
       Attempt to recover private keys from a corrupt wallet on startup

  -spendzeroconfchange
       Spend unconfirmed change when sending transactions (default: 1)

  -txconfirmtarget=<n>
       If paytxfee is not set, include enough fee so transactions begin
       confirmation on average within n blocks (default: 6)

  -walletrbf
       Send transactions with full-RBF opt-in enabled (RPC only, default: 0)

  -upgradewallet
       Upgrade wallet to latest format on startup

  -wallet=<file>
       Specify wallet file (within data directory) (default: wallet.dat)

  -walletbroadcast
       Make the wallet broadcast transactions (default: 1)

  -walletdir=<dir>
       Specify directory to hold wallets (default: <datadir>/wallets if it
       exists, otherwise <datadir>)

  -walletnotify=<cmd>
       Execute command when a wallet transaction changes (%s in cmd is replaced
       by TxID)

  -zapwallettxes=<mode>
       Delete all wallet transactions and only recover those parts of the
       blockchain through -rescan on startup (1 = keep tx meta data e.g.
       account owner and payment request information, 2 = drop tx meta
       data)

ZeroMQ notification options:

  -zmqpubhashblock=<address>
       Enable publish hash block in <address>

  -zmqpubhashtx=<address>
       Enable publish hash transaction in <address>

  -zmqpubrawblock=<address>
       Enable publish raw block in <address>

  -zmqpubrawtx=<address>
       Enable publish raw transaction in <address>

Debugging/Testing options:

  -uacomment=<cmt>
       Append comment to the user agent string

  -debug=<category>
       Output debugging information (default: 0, supplying <category> is
       optional). If <category> is not supplied or if <category> = 1,
       output all debugging information. <category> can be: net, tor,
       mempool, http, bench, zmq, db, rpc, estimatefee, addrman,
       selectcoins, reindex, cmpctblock, rand, prune, proxy, mempoolrej,
       libevent, coindb, qt, leveldb.

  -debugexclude=<category>
       Exclude debugging information for a category. Can be used in conjunction
       with -debug=1 to output debug logs for all categories except one
       or more specified categories.

  -help-debug
       Show all debugging options (usage: --help -help-debug)

  -logips
       Include IP addresses in debug output (default: 0)

  -logtimestamps
       Prepend debug output with timestamp (default: 1)

  -maxtxfee=<amt>
       Maximum total fees (in BTC) to use in a single wallet transaction or raw
       transaction; setting this too low may abort large transactions
       (default: 0.10)

  -printtoconsole
       Send trace/debug info to console instead of debug.log file

  -shrinkdebugfile
       Shrink debug.log file on client startup (default: 1 when no -debug)

Chain selection options:

  -testnet
       Use the test chain

Node relay options:

  -bytespersigop
       Equivalent bytes per sigop in transactions for relay and mining
       (default: 20)

  -datacarrier
       Relay and mine data carrier transactions (default: 1)

  -datacarriersize
       Maximum size of data in data carrier transactions we relay and mine
       (default: 83)

  -mempoolreplacement
       Enable transaction replacement in the memory pool (default: 1)

  -minrelaytxfee=<amt>
       Fees (in BTC/kB) smaller than this are considered zero fee for relaying,
       mining and transaction creation (default: 0.00001)

  -whitelistrelay
       Accept relayed transactions received from whitelisted peers even when
       not relaying transactions (default: 1)

  -whitelistforcerelay
       Force relay of transactions from whitelisted peers even if they violate
       local relay policy (default: 1)

Block creation options:

  -blockmaxweight=<n>
       Set maximum BIP141 block weight (default: 3996000)

  -blockmaxsize=<n>
       Set maximum BIP141 block weight to this * 4. Deprecated, use
       blockmaxweight

  -blockmintxfee=<amt>
       Set lowest fee rate (in BTC/kB) for transactions to be included in block
       creation. (default: 0.00001)

RPC server options:

  -server
       Accept command line and JSON-RPC commands

  -rest
       Accept public REST requests (default: 0)

  -rpcbind=<addr>[:port]
       Bind to given address to listen for JSON-RPC connections. This option is
       ignored unless -rpcallowip is also passed. Port is optional and
       overrides -rpcport. Use [host]:port notation for IPv6. This
       option can be specified multiple times (default: 127.0.0.1 and
       ::1 i.e., localhost, or if -rpcallowip has been specified,
       0.0.0.0 and :: i.e., all addresses)

  -rpccookiefile=<loc>
       Location of the auth cookie (default: data dir)

  -rpcuser=<user>
       Username for JSON-RPC connections

  -rpcpassword=<pw>
       Password for JSON-RPC connections

  -rpcauth=<userpw>
       Username and hashed password for JSON-RPC connections. The field
       <userpw> comes in the format: <USERNAME>:<SALT>$<HASH>. A
       canonical python script is included in share/rpcuser. The client
       then connects normally using the
       rpcuser=<USERNAME>/rpcpassword=<PASSWORD> pair of arguments. This
       option can be specified multiple times

  -rpcport=<port>
       Listen for JSON-RPC connections on <port> (default: 8332 or testnet:
       18332)

  -rpcallowip=<ip>
       Allow JSON-RPC connections from specified source. Valid for <ip> are a
       single IP (e.g. 1.2.3.4), a network/netmask (e.g.
       1.2.3.4/255.255.255.0) or a network/CIDR (e.g. 1.2.3.4/24). This
       option can be specified multiple times

  -rpcserialversion
       Sets the serialization of raw transaction or block hex returned in
       non-verbose mode, non-segwit(0) or segwit(1) (default: 1)

  -rpcthreads=<n>
       Set the number of threads to service RPC calls (default: 4)