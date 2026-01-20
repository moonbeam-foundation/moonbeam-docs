______________________________________________________________________

"
LITERAL BLOCK PRESERVATION (NON-NEGOTIABLE)

输入可能包含受保护的“字面块”，这些字面块由 HTML 注释分隔：

<!-- ROSE:BEGIN_LITERAL_BLOCK id=<id> preserve=verbatim -->

...

<!-- ROSE:END_LITERAL_BLOCK id=<id> -->

规则：

1. 您必须完全逐字符复制 BEGIN_LITERAL_BLOCK 和 END_LITERAL_BLOCK 之间的全部内容。
1. 请勿在字面块内翻译、改写、换行、规范化空格、更改缩进、重新排序行或修改标点符号。
1. 请勿更改字面块内的 Markdown 语法（包括但不限于：MkDocs Material 选项卡标题，如 === "Label"、选项卡下的缩进、围栏代码块、表格、HTML 或模板占位符，例如 {{ ... }}）。
1. 您必须完全按照提供的形式保留分隔符行本身。
1. 您可以自由地翻译/修改字面块之外的内容，但您不得移动字面块或更改其相对顺序。

如果字面块显示格式错误（例如，缺少 END 分隔符），请勿尝试“修复”它——完全按原样复制它并继续。

输出必须逐字保留字面块区域，并且仅将翻译/编辑应用于它们之外的文本。

## 标题：调试和追踪交易

描述：查看 Geth 的 Debug 和 Txpool API 以及 OpenEthereum 的 Trace 模块中包含的非标准 JSON-RPC 方法，这些方法在 Moonbeam 上受支持。
分类：JSON-RPC API，以太坊工具包

# 调试 API & 追踪模块

## 介绍 {: #introduction }

Geth 的 [debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=\_blank} 和 [txpool](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool){target=\_blank} API 以及 OpenEthereum 的 [trace](https://openethereum.github.io/JSONRPC-trace-module){target=\_blank} 模块提供了非标准的 RPC 方法，以便更深入地了解交易处理。作为 Moonbeam 为开发者提供无缝以太坊体验的目标的一部分，我们支持其中一些非标准的 RPC 方法。支持这些 RPC 方法是一个重要的里程碑，因为许多项目（如 [The Graph](https://thegraph.com){target=\_blank}）依赖它们来索引区块链数据。

本指南将介绍 Moonbeam 上可用的受支持 RPC 方法，以及如何使用 curl 命令针对启用了 debug、txpool 和 tracing 标志的追踪节点调用它们。您可以通过两种方式访问追踪节点：通过受支持的追踪 RPC 提供商或启动您自己的追踪节点。

要查看追踪 RPC 提供商的列表，请查看 [网络端点](/builders/get-started/endpoints/#tracing-providers){target=\_blank} 页面。

如果您希望设置自己的追踪节点，您可以按照 [运行追踪节点](/node-operators/networks/tracing-node/){target=\_blank} 指南进行操作。您的追踪节点的 RPC HTTP 端点应位于 `{{ networks.development.rpc_url }}`，并且您的节点应显示与以下内容类似的日志：

--8<-- 'code/builders/ethereum/json-rpc/debug-trace/terminal/start-up-logs.md'
