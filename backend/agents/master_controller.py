"""
Master Controller Agent
Orchestrates all other specialized agents in the AstraLearn AI system
"""

from typing import Dict, List, Optional, Any
import logging
from enum import Enum

logger = logging.getLogger(__name__)


class AgentType(Enum):
    """Types of specialized agents in the system"""
    READER = "reader"
    TUTOR = "tutor"
    CONTENT_CREATION = "content_creation"
    ASSESSMENT = "assessment"
    ACCESSIBILITY = "accessibility"
    ENGAGEMENT = "engagement"


class AgentTask:
    """Represents a task for an agent"""
    def __init__(self, task_id: str, agent_type: AgentType, description: str, 
                 priority: int = 5, context: Optional[Dict] = None):
        self.task_id = task_id
        self.agent_type = agent_type
        self.description = description
        self.priority = priority
        self.context = context or {}
        self.status = "pending"
        self.result = None


class MasterControllerAgent:
    """
    Master Controller Agent
    
    Purpose: Orchestrate all other agents in the system
    Capabilities:
    - Task delegation to specialized agents
    - Resource allocation and priority management
    - Agent coordination and communication
    - Result aggregation and delivery
    """
    
    def __init__(self):
        self.agents: Dict[AgentType, Any] = {}
        self.task_queue: List[AgentTask] = []
        self.active_tasks: Dict[str, AgentTask] = {}
        logger.info("Master Controller Agent initialized")
    
    def register_agent(self, agent_type: AgentType, agent_instance: Any):
        """Register a specialized agent with the controller"""
        self.agents[agent_type] = agent_instance
        logger.info(f"Registered agent: {agent_type.value}")
    
    def create_task(self, agent_type: AgentType, description: str, 
                   priority: int = 5, context: Optional[Dict] = None) -> str:
        """Create a new task for an agent"""
        task_id = f"task_{len(self.task_queue) + len(self.active_tasks)}"
        task = AgentTask(task_id, agent_type, description, priority, context)
        self.task_queue.append(task)
        self.task_queue.sort(key=lambda x: x.priority, reverse=True)
        logger.info(f"Created task {task_id} for {agent_type.value}")
        return task_id
    
    def delegate_task(self, task_id: str) -> bool:
        """Delegate a task to the appropriate agent"""
        task = next((t for t in self.task_queue if t.task_id == task_id), None)
        if not task:
            logger.error(f"Task {task_id} not found")
            return False
        
        if task.agent_type not in self.agents:
            logger.error(f"Agent {task.agent_type.value} not registered")
            return False
        
        self.task_queue.remove(task)
        self.active_tasks[task_id] = task
        task.status = "in_progress"
        
        logger.info(f"Delegated task {task_id} to {task.agent_type.value}")
        return True
    
    def get_task_status(self, task_id: str) -> Optional[Dict]:
        """Get the status of a task"""
        if task_id in self.active_tasks:
            task = self.active_tasks[task_id]
            return {
                "task_id": task.task_id,
                "agent_type": task.agent_type.value,
                "status": task.status,
                "description": task.description,
                "result": task.result
            }
        return None
    
    def complete_task(self, task_id: str, result: Any):
        """Mark a task as complete with its result"""
        if task_id in self.active_tasks:
            task = self.active_tasks[task_id]
            task.status = "completed"
            task.result = result
            logger.info(f"Task {task_id} completed")
    
    def get_system_status(self) -> Dict:
        """Get overall system status"""
        return {
            "registered_agents": [agent.value for agent in self.agents.keys()],
            "pending_tasks": len(self.task_queue),
            "active_tasks": len(self.active_tasks),
            "total_agents": len(self.agents)
        }


# Global instance of master controller
master_controller = MasterControllerAgent()
