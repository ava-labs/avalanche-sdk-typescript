import { AddPermissionlessDelegatorTx } from "./addPermissionlessDelegatorTx";
import { AddPermissionlessValidatorTx } from "./addPermissionlessValidatorTx";
import { AddSubnetValidatorTx } from "./addSubnetValidatorTx";
import { BaseTx } from "./baseTx";
import { CreateChainTx } from "./createChainTx";
import { CreateSubnetTx } from "./createSubnetTx";
import { ExportTx } from "./exportTx";
import { ImportTx } from "./importTx";
import { IncreaseL1ValidatorBalanceTx } from "./increaseL1ValidatorBalanceTx";
import { RemoveSubnetValidatorTx } from "./removeSubnetValidatorTx";
import { RegisterL1ValidatorTx } from "./registerL1ValidatorTx";
import { SetL1ValidatorWeightTx } from "./setL1ValidatorWeightTx";
import { DisableL1ValidatorTx } from "./disableL1ValidatorTx";
import { ConvertSubnetToL1Tx } from "./convertSubnetToL1Tx";

const txTypes = {
    AddPermissionlessDelegatorTx,
    AddPermissionlessValidatorTx,
    AddSubnetValidatorTx,
    BaseTx,
    CreateChainTx,
    CreateSubnetTx,
    ExportTx,
    ImportTx,
    IncreaseL1ValidatorBalanceTx,
    RemoveSubnetValidatorTx,
    RegisterL1ValidatorTx,
    SetL1ValidatorWeightTx,
    DisableL1ValidatorTx,
    ConvertSubnetToL1Tx,
}

export {
    txTypes,
}