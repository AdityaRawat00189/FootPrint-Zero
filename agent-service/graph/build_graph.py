import os
import sys
import logging
from typing import Literal, Dict, Any

# Ensure parent directory is in sys.path so sibling packages (agents, rag, tools) resolve anywhere
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from graph.state import CaseState
    from agents.discovery_agent import discovery_agent_node
    from agents.risk_ranking_agent import risk_ranking_agent_node
    from agents.legal_drafting_agent import legal_drafting_agent_node
    from agents.executor_agent import executor_agent_node
    from agents.followup_agent import followup_agent_node
except ImportError:
    from state import CaseState
    from agents.discovery_agent import discovery_agent_node
    from agents.risk_ranking_agent import risk_ranking_agent_node
    from agents.legal_drafting_agent import legal_drafting_agent_node
    from agents.executor_agent import executor_agent_node
    from agents.followup_agent import followup_agent_node

logger = logging.getLogger("FootprintZero.GraphBuilder")

def route_after_drafting(state: CaseState) -> Literal["executor_agent", "legal_drafting_agent", "__end__"]:
    """
    Conditional edge evaluator:
    - If user approved (approved == True), routes to executor_agent for dispatch.
    - If user rejected with feedback (approved == False), routes back to legal_drafting_agent for revision.
    - If awaiting approval (approved is None), graph terminates at the human approval gate.
    """
    approved = state.get("approved")
    if approved is True:
        return "executor_agent"
    elif approved is False:
        return "legal_drafting_agent"
    else:
        # Paused at Human Approval Gate
        return "__end__"

class FallbackExecutionGraph:
    """Fallback runner if langgraph is initializing."""
    def invoke(self, state: Dict[str, Any], config=None) -> Dict[str, Any]:
        curr = dict(state)
        # 1. Discovery
        d_res = discovery_agent_node(curr)
        curr.update(d_res)
        # 2. Risk Ranking
        r_res = risk_ranking_agent_node(curr)
        curr.update(r_res)
        # 3. Legal Drafting
        l_res = legal_drafting_agent_node(curr)
        curr.update(l_res)
        # Pauses before executor
        return curr

    def update_state(self, config, updates):
        pass

def build_footprint_graph(checkpointer=None):
    """
    Assembles the FootprintZero Multi-Agent LangGraph StateGraph.
    Includes human-in-the-loop pause (interrupt_before=["executor_agent"]),
    conditional approval edges, and durable checkpointer.
    """
    try:
        from langgraph.graph import StateGraph, END
        from langgraph.checkpoint.memory import MemorySaver

        builder = StateGraph(CaseState)
        
        # 1. Register the 5 core agent nodes
        builder.add_node("discovery_agent", discovery_agent_node)
        builder.add_node("risk_ranking_agent", risk_ranking_agent_node)
        builder.add_node("legal_drafting_agent", legal_drafting_agent_node)
        builder.add_node("executor_agent", executor_agent_node)
        builder.add_node("followup_agent", followup_agent_node)
        
        # 2. Wire standard edges
        builder.set_entry_point("discovery_agent")
        builder.add_edge("discovery_agent", "risk_ranking_agent")
        builder.add_edge("risk_ranking_agent", "legal_drafting_agent")
        
        # 3. Add conditional edge after legal drafting
        builder.add_conditional_edges(
            "legal_drafting_agent",
            route_after_drafting,
            {
                "executor_agent": "executor_agent",
                "legal_drafting_agent": "legal_drafting_agent",
                "__end__": END
            }
        )
        
        builder.add_edge("executor_agent", END)
        builder.add_edge("followup_agent", END)
        
        # Use MemorySaver or supplied Mongo checkpointer
        cp = checkpointer or MemorySaver()
        
        # Compile graph with human-in-the-loop interruption before executor
        graph = builder.compile(
            checkpointer=cp,
            interrupt_before=["executor_agent"]
        )
        logger.info("LangGraph compiled successfully with interrupt_before=['executor_agent'].")
        return graph
    except Exception as e:
        logger.warning(f"LangGraph compile note: {str(e)}. Using standard state machine engine.")
        return FallbackExecutionGraph()

# Global shared graph instance
_compiled_graph = None

def get_compiled_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_footprint_graph()
    return _compiled_graph
