solidity
 struct Multilocation {
    uint8 parents;
    bytes[] interior;
}

与标准的 [multilocation](/builders/interoperability/xcm/core-concepts/multilocations/){target=\_blank} 一样，也有 `parents` 和 `interior` 元素。但是，以太坊库不是将多重地址定义为对象，而是将结构体定义为一个数组，该数组包含一个 `uint8` 作为 `parents` 的第一个元素，一个字节数组作为 `interior` 的第二个元素。

您通常会看到的 `parents` 元素的值为：

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

对于 `interior` 元素，您需要在目标链中向下钻取以到达目标的确切位置（例如特定资产或帐户）的字段数表示字节数组的大小：

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

!!! note
    内部值 `Here` 通常用于中继链（作为目标或用于定位中继链资产）。

到达目标的确切位置所需的每个字段都需要定义为十六进制字符串。第一个字节（2 个十六进制字符）对应于字段的选择器。例如：

| Byte Value |    Selector    | Data Type |
|:----------:|:--------------:|-----------|
|    0x00    |   Parachain    | bytes4    |
|    0x01    |  AccountId32   | bytes32   |
|    0x02    | AccountIndex64 | u64       |
|    0x03    |  AccountKey20  | bytes20   |
|    0x04    | PalletInstance | byte      |
|    0x05    |  GeneralIndex  | u128      |
|    0x06    |   GeneralKey   | bytes[]   |

接下来，根据选择器及其数据类型，以下字节对应于所提供的实际数据。请注意，对于 `AccountId32`、`AccountIndex64` 和 `AccountKey20`，可选的 `network` 字段会附加在末尾。例如：

|    Selector    |       Data Value       |             Represents             |
|:--------------:|:----------------------:|:----------------------------------:|
|   Parachain    |    "0x00+000007E7"     |         Parachain ID 2023          |
|  AccountId32   | "0x01+AccountId32+00"  | AccountId32, Network(Option) Null  |
|  AccountId32   | "0x01+AccountId32+03"  |   AccountId32, Network Polkadot    |
|  AccountKey20  | "0x03+AccountKey20+00" | AccountKey20, Network(Option) Null |
| PalletInstance |       "0x04+03"        |         Pallet Instance 3          |

!!! note
    `interior` 数据通常需要用引号括起来，否则可能会收到 `invalid tuple value` 错误。
