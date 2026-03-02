import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Alert,
    ScrollView,
    Linking,
} from "react-native";
export default function WalletScreen() {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [tokens, setTokens] = useState<any[]>([]);
    const [txns, setTxns] = useState<any[]>([]);
    const RPC = "https://api.mainnet-beta.solana.com";

    const rpc = async (method: string, params: any[]) => {
        const res = await fetch(RPC, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        return json.result;
    };
    const getBalance = async (addr: string) => {
        const result = await rpc("getBalance", [addr]);
        return (result?.value || 0) / 1_000_000_000;
    };
    const getTokens = async (addr: string) => {
        const result = await rpc("getTokenAccountsByOwner", [
            addr,
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            { encoding: "jsonParsed" },
        ]);
        return (result.value || [])
            .map((a: any) => ({
                mint: a.account.data.parsed.info.mint,
                amount: a.account.data.parsed.info.tokenAmount.uiAmount,
            }))
            .filter((t: any) => t.amount > 0);
    };
    const getTxns = async (addr: string) => {
        const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
        return (sigs || []).map((s: any) => ({
            sig: s.signature,
            time: s.blockTime,
            ok: !s.err,
        }));
    };
    const short = (s: string, n = 4) => `${s.slice(0, n)}...${s.slice(-n)}`;

    const timeAgo = (ts: number) => {
        const s = Math.floor(Date.now() / 1000 - ts);
        if (s < 60) return `${s}s ago`;
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    const search = async () => {
        const addr = address.trim();
        if (!addr) return Alert.alert("Enter a wallet address");

        setLoading(true);
        try {
            const [bal, tok, tx] = await Promise.all([
                getBalance(addr),
                getTokens(addr),
                getTxns(addr),
            ]);
            setBalance(bal);
            setTokens(tok);
            setTxns(tx);
        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
        setLoading(false);
    };
    return (
        <View style={s.wrapper}>
            <View style={s.header}>
                <Text style={s.title}>Solana Wallet</Text>
                <Text style={s.subtitle}>View your balance & transactions</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={s.container}
                showsVerticalScrollIndicator={false}
            >
                <TextInput
                    style={s.input}
                    placeholder="Solana wallet address..."
                    placeholderTextColor="#555"
                    value={address}
                    onChangeText={setAddress}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <TouchableOpacity
                    style={[s.btn, loading && s.btnDisabled]}
                    onPress={search}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={s.btnText}>Search Wallet</Text>
                    )}
                </TouchableOpacity>

                {balance !== null && (
                    <>
                        <View style={s.card}>
                            <Text style={s.label}>SOL Balance</Text>
                            <Text style={s.balance}>{balance.toFixed(4)}</Text>
                            <Text style={s.sol}>SOL</Text>
                            <Text style={s.addr}>{short(address.trim(), 8)}</Text>
                        </View>
                        {/* 
            {tokens.length > 0 && (
              <>
                <Text style={s.sectionTitle}>Tokens ({tokens.length})</Text>
                <FlatList
                  data={tokens}
                  keyExtractor={(t) => t.mint}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={s.row}>
                      <View>
                        <Text style={s.mint}>{short(item.mint, 8)}</Text>
                        <Text style={s.description}>Token</Text>
                      </View>
                      <Text style={s.amount}>{item.amount.toFixed(2)}</Text>
                    </View>
                  )}
                />
              </>
            )} */}

                        {txns.length > 0 && (
                            <>
                                <Text style={s.sectionTitle}>Recent Transactions ({txns.length})</Text>
                                <FlatList
                                    data={txns}
                                    keyExtractor={(t) => t.sig}
                                    scrollEnabled={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL(`https://solscan.io/tx/${item.sig}`)}
                                            style={s.txPressable}
                                            activeOpacity={0.7}
                                        >
                                            <View style={s.txRow}>
                                                <View style={s.txInfo}>
                                                    <Text style={s.txSig}>{short(item.sig, 8)}</Text>
                                                    <Text style={s.txTime}>{timeAgo(item.time)}</Text>
                                                </View>
                                                <View style={[s.txStatus, item.ok ? s.statusOk : s.statusFail]}>
                                                    <Text style={s.txIcon}>{item.ok ? "✓" : "✗"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </>
                        )}

                        {tokens.length === 0 && txns.length === 0 && (
                            <View style={s.emptyState}>
                                <Text style={s.emptyText}>No tokens or transactions found</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#0f0f1e",
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#1a1a2e",
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a4e",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#14F195",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#888",
    },
    container: {
        padding: 16,
        flexGrow: 1,
    },
    input: {
        backgroundColor: "#1a1a2e",
        color: "white",
        padding: 14,
        borderRadius: 10,
        marginBottom: 14,
        borderColor: "#2a2a4e",
        borderWidth: 1,
        fontSize: 16,
    },
    btn: {
        backgroundColor: "#14F195",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#14F195",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
    card: {
        backgroundColor: "#1a1a2e",
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        borderColor: "#2a2a4e",
        borderWidth: 1,
    },
    label: {
        color: "#888",
        fontSize: 12,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    balance: {
        color: "#14F195",
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 4,
    },
    sol: {
        color: "#14F195",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 12,
    },
    addr: {
        color: "#666",
        fontSize: 12,
        fontFamily: "monospace",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#14F195",
        marginBottom: 12,
        marginTop: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1a1a2e",
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
        borderColor: "#2a2a4e",
        borderWidth: 1,
    },
    mint: {
        color: "#14F195",
        fontWeight: "600",
        fontSize: 13,
        fontFamily: "monospace",
    },
    description: {
        color: "#666",
        fontSize: 11,
        marginTop: 4,
    },
    amount: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    txRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1a1a2e",
        padding: 14,
        borderRadius: 10,
        borderColor: "#2a2a4e",
        borderWidth: 1,
    },
    txPressable: {
        marginBottom: 8,
    },
    txInfo: {
        flex: 1,
    },
    txSig: {
        color: "#14F195",
        fontWeight: "600",
        fontSize: 12,
        fontFamily: "monospace",
    },
    txTime: {
        color: "#888",
        fontSize: 11,
        marginTop: 6,
    },
    txStatus: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    statusOk: {
        backgroundColor: "rgba(20, 241, 149, 0.67)",
    },
    statusFail: {
        backgroundColor: "rgba(255, 107, 107, 0.2)",
    },
    txIcon: {
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#666",
        fontSize: 14,
    },
});