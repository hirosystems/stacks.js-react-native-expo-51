import { Wallet, generateSecretKey, generateWallet } from "@stacks/wallet-sdk";
import { useState } from "react";
import { Button, Image, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  TransactionVersion,
  getAddressFromPrivateKey,
  makeSTXTokenTransfer,
} from "@stacks/transactions";

// import * as crypto from "crypto";
// console.log("crypto", crypto);
// console.log("crypto.randomBytes", crypto.randomBytes);

export default function HomeScreen() {
  const [mnemonic, setMnemonic] = useState("...");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [log, setLog] = useState("");

  const generate = async () => {
    const mnemonic = generateSecretKey();
    setMnemonic(mnemonic);

    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: "",
    });
    setWallet(wallet);

    await makeSTXTokenTransfer({
      amount: 1000,
      anchorMode: "any",
      recipient: "SP3W993D3BRDYB284CY3SBFDEGTC5XEDJPDEA21CN",
      senderKey: wallet.accounts[0].stxPrivateKey,
      fee: 10,
      network: "mainnet",
      nonce: 0,
    });
    setLog("Transaction signed successfully ☑");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Stacks + Expo</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Seed Phrase</ThemedText>
        <ThemedText style={styles.mono}>{mnemonic}</ThemedText>
        <Button title="Generate Seed Phrase" onPress={generate} />
        {wallet && (
          <>
            <ThemedText type="subtitle">Address</ThemedText>
            <ThemedText style={styles.mono}>
              {getAddressFromPrivateKey(
                wallet.accounts[0].stxPrivateKey,
                TransactionVersion.Mainnet
              )}
            </ThemedText>
          </>
        )}
        {log && <ThemedText style={styles.log}>{log}</ThemedText>}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  mono: {
    fontFamily: "Menlo",
  },
  log: {
    color: "lightgray",
    textAlign: "center",
  },
});
