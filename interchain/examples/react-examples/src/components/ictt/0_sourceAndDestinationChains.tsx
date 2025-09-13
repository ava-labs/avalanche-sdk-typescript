import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

export default function SourceAndDestinationChains(props: {
    sourceChain: string;
    destinationChain: string;
    setSourceChain: (chain: string) => void;
    setDestinationChain: (chain: string) => void;
}) {
    return (
        <div>
            <label>Select Source Chain</label><br/>
            <select value={props.sourceChain} onChange={e => props.setSourceChain(e.target.value)}>
                <option value={avalancheFuji.name}>{avalancheFuji.name}</option>
                <option value={dispatch.name}>{dispatch.name}</option>
            </select><br/><br/>

            <label>Select Destination Chain</label><br/>
            <select value={props.destinationChain} onChange={e => props.setDestinationChain(e.target.value)}>
                <option value={avalancheFuji.name}>{avalancheFuji.name}</option>
                <option value={dispatch.name}>{dispatch.name}</option>
            </select><br/><br/>
        </div>
    );
}
