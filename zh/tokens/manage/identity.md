---
title: 管理身份
description: 了解如何在 Moonbeam 的网络上创建和管理链上身份，其中包括您的姓名和社交账号等个人信息。
categories: 代币和帐户
---

# 管理您的帐户身份

## 简介 {: #introduction }

Substrate Identity pallet 是一个开箱即用的解决方案，用于向您的链上账户添加个人信息。个人信息可以包括默认字段，如您的法定姓名、显示名称、网站、Twitter 账号、Riot（现在称为 Element）名称。您还可以利用自定义字段来包含任何其他相关信息。

一旦您的身份信息上链，您可以向注册员请求验证您的身份。注册员将进行适当的尽职调查，以验证提交的身份信息，并根据他们的调查结果在链上提供他们的判断，您的账户旁边将出现一个绿色的复选标记。

本指南将向您展示如何在 Moonbase Alpha TestNet 上设置身份、清除身份以及请求判断。本指南也可以调整后在 Moonbeam 和 Moonriver 上使用。

## 通用定义 {: #general-definitions }

要将您的信息存储在链上，您必须绑定一些资金，这些资金最终将在身份验证完成后退还。字段分为两类：默认字段和自定义字段。如果使用自定义字段，您需要为每个字段提交额外的保证金。

- **默认字段包括** - 您的法定姓名、显示名称、网站、Twitter 句柄、Riot（现在称为 Element）名称

- **自定义字段包括** - 任何其他相关信息。例如，您可以包括您的 Discord 句柄

=== "Moonbeam"
    |       Variable        |                               Definition                                |                      Value                      |
    |:---------------------:|:-----------------------------------------------------------------------:|:-----------------------------------------------:|
    |     Basic deposit     |           The amount held on deposit for setting an identity            | {{ networks.moonbeam.identity.basic_dep }} GLMR |
    |     Field deposit     | The amount held on deposit per additional field for setting an identity | {{ networks.moonbeam.identity.field_dep }} GLMR |
    | Max additional fields |     Maximum number of additional fields that may be stored in an ID     |   {{ networks.moonbeam.identity.max_fields }}   |

=== "Moonriver"
    |       Variable        |                               Definition                                |                      Value                       |
    |:---------------------:|:-----------------------------------------------------------------------:|:------------------------------------------------:|
    |     Basic deposit     |           The amount held on deposit for setting an identity            | {{ networks.moonriver.identity.basic_dep }} MOVR |
    |     Field deposit     | The amount held on deposit per additional field for setting an identity | {{ networks.moonriver.identity.field_dep }} MOVR |
    | Max additional fields |     Maximum number of additional fields that may be stored in an ID     |   {{ networks.moonriver.identity.max_fields }}   |

=== "Moonbase Alpha"
    |       Variable        |                               Definition                                |                     Value                      |
    |:---------------------:|:-----------------------------------------------------------------------:|:----------------------------------------------:|
    |     Basic deposit     |           The amount held on deposit for setting an identity            | {{ networks.moonbase.identity.basic_dep }} DEV |
    |     Field deposit     | The amount held on deposit per additional field for setting an identity | {{ networks.moonbase.identity.field_dep }} DEV |
    | Max additional fields |     Maximum number of additional fields that may be stored in an ID     |  {{ networks.moonbase.identity.max_fields }}   |

## 检查先决条件 { : #checking-prerequisites }

对于本指南，您将需要以下内容：

- 要在 Polkadot.js Apps 浏览器上连接到 [Moonbase Alpha TestNet](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=\_blank}。您也可以按照并调整 [Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=\_blank} 或 [Moonriver](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network){target=\_blank} 的说明进行操作。
- 要将 [创建或导入帐户](tokens/connect/polkadotjs/#creating-or-importing-an-h160-account) 到 Polkadot.js Apps
- 确保您已为您的帐户充值。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

## 开始 {: #get-started }

根据要包含的信息，可以使用 Polkadot.js Apps 通过几种不同的方式来设置和清除身份。如果您打算仅使用默认字段注册您的身份，则可以按照[通过 Accounts UI 管理身份](#manage-via-accounts)的说明进行操作。**这是设置和管理您的身份的推荐方式**。

如果您正在寻找更可定制的体验，并且想要在默认字段之外添加自定义字段，则可以按照[通过 Extrinsics UI 管理身份](#manage-via-extrinsics)的说明进行操作。

!!! note
    请注意，建议在 Polkadot.js Apps 上使用 **Accounts** UI 来管理您的身份，因为它提供了一个易于使用的界面，可以强制执行字符限制。如果您使用 **Extrinsics** UI，请注意，您对每个字段（即名称、电子邮件等）的输入必须小于或等于 32 个字符，否则，您的信息将被截断。

## 通过帐户管理身份 {: #manage-via-accounts }

### 设置身份 {: #set-identity-accounts }

要开始使用 Accounts UI 设置身份，请前往 Polkadot.js Apps 浏览器的[帐户选项卡](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=\_blank}。

您应该已经连接了一个帐户，因此您可以继续单击您的帐户名称以验证并记下您的余额。 在您发送交易以设置身份后，您提交的存款将从您的可转让余额转移到您的预留余额。

![起始帐户余额](/images/tokens/manage/identity/identity-1.webp)

要设置您的身份，您需要：

1. 单击要为其设置身份的帐户旁边的 3 个垂直点
2. 将弹出一个菜单。 点击**设置链上身份**

![设置链上身份](/images/tokens/manage/identity/identity-2.webp)

接下来，将弹出注册和设置您身份的菜单，您可以开始填写您的信息。 您不需要为每个字段都输入信息，您可以选择只填写一个字段或者全部填写，这取决于您。 对于本例：

1. 设置您的显示名称
2. 单击电子邮件的**包含字段**切换按钮，然后输入您的电子邮件
3. 单击 Twitter 的**包含字段**切换按钮，然后输入您的 Twitter 句柄
4. 填写完您的信息并且存款金额对您来说没有问题后，单击**设置身份**

![设置您的身份](/images/tokens/manage/identity/identity-3.webp)

然后将提示您签署交易。 如果一切看起来都不错，您可以输入您的密码并单击**签名并提交**以签名并发送交易。

您应该在右上角看到状态通知弹出。 交易确认后，您可以再次单击您的帐户名称，面板将从页面右侧滑出。 您的余额将会改变，您还会看到您的新身份信息。

![更新的帐户余额](/images/tokens/manage/identity/identity-4.webp)

如果身份信息与您输入的信息匹配，则您已成功设置身份！

清除身份后，您预留余额中的存款将转回您的可转让余额。 如果您需要更改您的身份，您可以再次进行设置身份的过程。 请注意，您需要确保重新输入所有字段，即使只需要更改一个字段，否则它们将被覆盖。 除非使用自定义字段，否则您无需支付另一笔存款，但您需要支付 gas 费用。

### 清除身份信息 {: #clear-identity-accounts }

要从 Polkadot.js Apps UI 的[账户选项卡](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=\_blank}中清除您的身份信息，您需要：

1. 点击您想要添加身份信息的账户旁边的 3 个垂直点
2. 将弹出一个菜单。点击 **设置链上身份**

![设置链上身份](/images/tokens/manage/identity/identity-5.webp)

身份信息菜单将会弹出，其中已经填写了您的信息。您需要点击 **清除身份**。

![清除身份](/images/tokens/manage/identity/identity-6.webp)

然后，系统会提示您签署交易。如果一切看起来都很好，您可以输入您的密码并点击 **签名并提交** 以签名并发送交易。

您应该会在右上角看到状态通知弹出。交易确认后，您可以再次点击您的帐户名，面板将从页面右侧滑出。您可以看到您保留的余额已转回您的可转账余额，并且您的身份信息已被删除。

就是这样！您已成功清除您的身份信息。如果您想添加新的身份信息，您可以随时进行。

## 通过外部因素管理身份 {: #manage-via-extrinsics }

### 设置身份 {: #set-identity-extrinsics }

要使用 extrinsic 用户界面注册身份，请导航至 Polkadot.js Apps 上的[Extrinsics 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=\_blank}。然后，您需要：

1. 选择您的帐户
2. 从**submit the following extrinsic**下拉菜单中选择 identity
3. 然后选择 **setIdentity(info)** 函数
4. 开始填写您的身份信息。请确保对于每个字段，您的输入不超过 32 个字符
    1. 选择数据的格式。对于此示例，您可以使用 **Raw** 数据，但您也可以输入 BlackTwo256、Sha256、Keccak256 和 ShaThree256 哈希格式的数据
    2. 以该格式输入数据

![使用 Extrinsics UI 设置您的身份](/images/tokens/manage/identity/identity-7.webp)

（可选）如果您想输入自定义字段，您可以这样做：

1. 滚动到顶部并单击 **Add item**
2. 将出现两个字段：第一个用于字段名称，第二个用于值。请确保每个字段和值的输入都不超过 32 个字符。填写字段名称
    1. 选择字段名称的数据格式。同样，您可以使用 **Raw** 数据
    2. 以选定的格式输入字段名称
3. 填写值
    1. 选择值的数据格式。同样，您可以使用 **Raw** 数据
    2. 以选定的格式输入值

![添加自定义字段](/images/tokens/manage/identity/identity-8.webp)

最后，一旦添加了所有身份信息，您可以滚动到页面底部并单击 **Submit Transaction**。

![提交身份信息](/images/tokens/manage/identity/identity-9.webp)

然后系统会提示您签署交易。请记住，每个额外的自定义字段都需要额外的存款。如果一切看起来都不错，您可以输入您的密码并单击 **Sign and Submit** 以签名并发送交易。

您应该在右上角看到状态通知弹出窗口，确认交易。如果成功，您就设置了身份！恭喜！为了确保一切顺利进行并且您的身份信息看起来不错，接下来您可以确认您的身份。

### 确认身份 {: #confirm-identity-extrinsics }

要验证您的身份信息的添加，您可以点击**开发者**选项卡，然后导航至[链状态](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=\_blank}。

在**链状态**用户界面上，确保已选择“**存储**”。然后，您可以开始请求您的身份信息：

1. 将**选择的状态查询**设置为**身份**
2. 选择 **identityOf(AccountId)** 函数
3. 选择您的帐户
4. 点击 **+** 按钮以获取您的身份信息

![请求身份信息](/images/tokens/manage/identity/identity-10.webp)

您现在可以看到您已成功设置身份！一旦您清除您的身份，您保留余额中的存款将转回您的可转让余额。如果您需要更改您的身份，您可以再次进行设置身份的过程。 请注意，您需要确保重新输入所有字段，即使只需要更改一个字段，否则它们将被覆盖。 除非使用自定义字段，否则您无需支付另一笔存款，但您需要支付燃料费。

### 清除身份信息 {: #clear-identity-extrinsics }

要从 Polkadot.js Apps UI 的 [Extrinsics 选项卡](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=\_blank} 中清除您的身份信息，您需要：

1. 从**使用所选账户**下拉列表中选择您的账户
2. 从**提交以下 extrinsic** 下拉列表中选择 **identity**
3. 然后选择 **clearIdentity()** 函数
4. 点击 **Submit Transaction**

![使用 Extrinsics UI 清除身份信息](/images/tokens/manage/identity/identity-11.webp)

然后，系统将提示您签署交易。如果一切正常，您可以输入密码并点击 **Sign and Submit** 以签署并发送交易。

您应该会在右上角看到状态通知弹出窗口，确认交易。

要验证您的身份信息是否已删除，您可以再次按照 [确认身份信息](#confirm-identity-extrinsics) 部分中的步骤进行操作。这次您将收到 **none** 的响应，而不是看到您的身份信息。这意味着您不再有与您的账户相关的任何身份信息。如果您检查您的余额，您应该会看到设置您的身份信息的初始存款已退回到您的可转移余额中。就这样！您的身份信息已清除。

## 身份判断 {: #identity-judgement }

提交您的身份信息后，您可以向注册员请求验证您的身份。注册员的任务是验证提交的身份信息，并可以为他们的服务设置费用。当您请求判断时，您需要指定您希望哪个注册员验证您的信息，以及您愿意为他们提供判断支付的最高费用。只有当选定的注册员收取的费用低于您指定的最高费用时，该请求才会被处理，否则交易将失败。费用将被锁定，直到注册员完成判断过程，之后费用才会转移给注册员。注册员费用是您最初创建身份时支付的押金之外的费用。

注册员申请人通过链上民主选举产生。如果被任命的注册员做出不正确的判断或被证明不可信，他们可以通过民主程序被撤职。

注册员将进行适当的尽职调查，以验证提交的身份信息，并根据他们的调查结果提供判断，并分配最多七个级别的可信度：

- **未知** - 尚未做出判断。这是默认值
- **已支付费用** - 表示用户已请求判断，且正在进行中
- **合理** - 信息看起来是合理的，但没有使用法律身份文件进行深入检查
- **已知良好** - 信息是正确的，并且基于对法律身份文件的审查
- **已过期** - 信息曾经是好的，但现在已过期
- **低质量** - 信息质量低或不精确，但可以根据需要进行更新
- **错误** - 信息是错误的，可能表明有恶意。此状态无法修改，只有在整个身份被删除后才能删除

### 当前注册人 {: #current-registrars }

在请求身份判断时，您需要提供您希望完成请求的注册人的索引。

目前的注册人如下：

=== "Moonbeam"
    |                                                                注册人                                                                |                              运营商                               |                  地址                   | 索引 |
    |:---------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------:|:------------------------------------------:|:-----:|
    |        [注册人 #0](https://forum.moonbeam.network/t/referendum-73-identity-registrar-0/208){target=\_blank}        | [Moonbeam 基金会](https://moonbeam.foundation){target=\_blank} | 0xbE6E642b25Fa7925AFA1600C48Ab9aA3461DC7f1 |   0   |
    | [注册人 #1](https://forum.moonbeam.network/t/referendum-82-new-registrar-proposal-registrar-1/319){target=\_blank} |         [Chevdor](https://www.chevdor.com){target=\_blank}         | 0xeaB597B91b66d9C3EA5E3a39e22C524c287d61a5 |   1   |

=== "Moonriver"
    |                                                                注册人                                                                 |                              运营商                               |                  地址                   | 索引 |
    |:----------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------:|:------------------------------------------:|:-----:|
    |         [注册人 #0](https://forum.moonbeam.network/t/referendum-120-identity-registrar-0/187){target=\_blank}          | [Moonbeam 基金会](https://moonbeam.foundation){target=\_blank} | 0x031590D13434CC554f7257A89B2E0B10d67CCCBa |   0   |
    | [注册人 #1](https://forum.moonbeam.network/t/referendum-125-new-registrar-proposal-registrar-1/303){target=\_blank} |         [Chevdor](https://www.chevdor.com){target=\_blank}         | 0x2d18250E01312A155E81381F938B8bA8bb4d97B3 |   1   |

=== "Moonbase Alpha"
    |                                      注册人                                       |                      运营商                       |                  地址                   | 索引 |
    |:------------------------------------------------------------------------------------:|:---------------------------------------------------:|:------------------------------------------:|:-----:|
    | [注册人 #1](https://www.chevdor.com/post/2020/07/14/reg-updates){target=\_blank} | [Chevdor](https://www.chevdor.com){target=\_blank} | 0x4aD549e07E96BaD335A8b99C8fd32e95EE538904 |   1   |

您可以通过访问 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=\_blank}，选择 **开发者** 选项卡，从下拉菜单中选择 **链状态**，并按照以下步骤操作，获取当前注册人的完整列表，包括每个注册人收取的费用：

1. 选择 **identity** 托盘
2. 选择 **registrars** 外部函数
3. 点击 **+** 按钮

![查看注册人列表](/images/tokens/manage/identity/identity-12.webp)

### 请求身份判断 {: #request-judgement }

要请求身份判断，请在**Extrinsics**页面中执行以下步骤：

1. 从**使用所选帐户**下拉列表中选择您的帐户
2. 从**提交以下外部因素**下拉列表中选择**身份**
3. 然后选择 **requestJudgement()** 函数
4. 输入您想要审查的注册器的索引，并提供关于您的身份信息的判断
5. 输入您愿意支付的最高费用（以Wei为单位）。这必须高于注册器设置的费用，否则交易将失败
6. 点击 **提交交易**

![请求身份判断](/images/tokens/manage/identity/identity-13.webp)

一旦交易完成，费用将从您的可用余额中扣除并锁定，直到判断完成。

判断完成后，如果您已成功通过验证，则您的帐户旁边会出现一个绿色复选标记。 如果成功，您的身份将被分配以下三个可信度级别之一：低质量、合理或已知良好。 在**帐户**页面中，您可以点击您的帐户名以查看您的身份信息和您的身份判断结果。

![身份已验证](/images/tokens/manage/identity/identity-14.webp)

### 取消身份判断请求 {: #cancel-judgement-request }

如果注册人尚未完成您的判断，您可以取消该请求并取回锁定的费用。为此，请从**Extrinsics**页面执行以下步骤：

1. 从**using the selected account**下拉菜单中选择您的帐户
2. 从**submit the following extrinsic**下拉菜单中选择**identity** 
3. 然后选择 **cancelRequest()** 函数
4. 点击 **Submit Transaction**

![取消判断请求](/images/tokens/manage/identity/identity-15.webp)

然后，系统将提示您签名并发送交易。一旦交易完成，您锁定的资金将退还给您。
