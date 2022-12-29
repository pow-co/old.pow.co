
import { Script } from '@runonbitcoin/nimble'
import bops from 'bops'

interface SendMessage {
    app: string;
    channel: string;
    message: string;
}

export async function sendMessage({ app, channel, message }: SendMessage): Promise<void> {

  console.log("sendMessage", { app, channel, message })

      // Create data payload for Message Schema
      let dataPayload: string[] = [
        "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", // B Prefix
        message,
        "text/plain",
        "utf-8",
        "|",
        "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", // MAP Prefix
        "SET",
        "app",
        app,
        "type",
        "message",
        "author",
        "#{address}",
        "paymail",
        "#{paymail}",
        "context",
        "channel",
        "channel",
        channel,
        "|"
      ];

      const cryptoOperations = [{
        name: 'address',
        method: 'address',
        key: 'identity'
      }, {
        name: 'paymail',
        method: 'paymail',
        key: 'identity'
      }, {
        name: 'signature',
        method: 'sign',
        data: dataPayload.join(''),
        dataEncoding: 'utf8',
        key: 'identity',
        algorithm: 'bitcoin-signed-message'
      }]

      dataPayload = [
        ...dataPayload,
        '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva', // AUTHOR IDENTITY PROTOCOL PREFIX
        'BITCOIN_ECDSA',
        "#{address}",
        "#{signature}"
      ]

      // Channels get used in chat apps like: https://bitchatnitro.com/
      const script = Script.fromASM(
        "OP_0 OP_RETURN " +
        dataPayload
          .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
          .join(" ")
      );

      console.log(script.toASM())

      let outputs: { script: string, amount: number, currency: string }[] = [{script: script.toASM(), amount: 0, currency: "BSV" }];

      //@ts-ignore
      let resp = await window.relayone.send({
        outputs,
        cryptoOperations
      });

      let txid = resp.txid;

      return resp;

  }