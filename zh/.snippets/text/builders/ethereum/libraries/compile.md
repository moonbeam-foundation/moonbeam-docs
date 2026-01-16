接下来，你将为此文件创建脚本并完成以下步骤：

1. 导入 `fs` 和 `solc` 包
2. 使用 `fs.readFileSync` 函数，你将读取并将 `Incrementer.sol` 的文件内容保存到 `source`
3. 通过指定要使用的 `language`、`sources` 和 `settings`，为 Solidity 编译器构建 `input` 对象
4. 使用 `input` 对象，你可以使用 `solc.compile` 编译合约
5. 提取已编译的合约文件并将其导出以在部署脚本中使用
