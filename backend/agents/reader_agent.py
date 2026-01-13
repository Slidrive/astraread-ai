"""
Reader Agent
Enhanced speed reading with adaptive pacing
"""

from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class ReaderAgent:
    """
    Reader Agent
    
    Purpose: Implement advanced speed reading with adaptive pacing
    Capabilities:
    - Intelligent text chunking based on comprehension patterns
    - Adaptive WPM adjustment based on content complexity
    - Real-time difficulty assessment
    - Reading pattern analysis
    """
    
    def __init__(self):
        self.default_wpm = 500
        self.min_wpm = 200
        self.max_wpm = 1000
        logger.info("Reader Agent initialized")
    
    def chunk_text(self, text: str, complexity_level: Optional[str] = None) -> List[Dict]:
        """
        Chunk text into optimal reading segments
        
        Args:
            text: The text to chunk
            complexity_level: Optional complexity hint (simple, medium, complex)
        
        Returns:
            List of chunks with metadata
        """
        # Simple chunking for now - can be enhanced with NLP
        words = text.split()
        chunks = []
        
        # Determine chunk size based on complexity
        base_chunk_size = 3
        if complexity_level == "simple":
            base_chunk_size = 4
        elif complexity_level == "complex":
            base_chunk_size = 2
        
        for i in range(0, len(words), base_chunk_size):
            chunk_words = words[i:i + base_chunk_size]
            chunks.append({
                "words": chunk_words,
                "text": " ".join(chunk_words),
                "index": len(chunks),
                "focus_word_index": min(1, len(chunk_words) - 1)
            })
        
        logger.info(f"Chunked text into {len(chunks)} segments")
        return chunks
    
    def calculate_adaptive_wpm(self, content_type: str, user_proficiency: float) -> int:
        """
        Calculate adaptive reading speed based on content and user
        
        Args:
            content_type: Type of content (technical, narrative, etc.)
            user_proficiency: User's reading proficiency (0.0 to 1.0)
        
        Returns:
            Recommended WPM
        """
        base_wpm = self.default_wpm
        
        # Adjust for content type
        type_multipliers = {
            "technical": 0.7,
            "narrative": 1.2,
            "academic": 0.8,
            "casual": 1.3
        }
        
        multiplier = type_multipliers.get(content_type, 1.0)
        adjusted_wpm = int(base_wpm * multiplier * (0.5 + 0.5 * user_proficiency))
        
        # Clamp to min/max
        return max(self.min_wpm, min(self.max_wpm, adjusted_wpm))
    
    def analyze_reading_pattern(self, session_data: Dict) -> Dict:
        """
        Analyze user's reading patterns and provide insights
        
        Args:
            session_data: Dictionary with session metrics
        
        Returns:
            Analysis with recommendations
        """
        analysis = {
            "average_wpm": session_data.get("wpm", self.default_wpm),
            "comprehension_estimate": "medium",
            "recommendations": []
        }
        
        # Add recommendations based on patterns
        if session_data.get("pauses", 0) > 10:
            analysis["recommendations"].append({
                "type": "pacing",
                "message": "Consider reducing speed for better comprehension"
            })
        
        return analysis
    
    def prepare_reading_session(self, text: str, user_preferences: Dict) -> Dict:
        """
        Prepare a complete reading session with all parameters
        
        Args:
            text: The text to read
            user_preferences: User's reading preferences
        
        Returns:
            Complete session configuration
        """
        wpm = user_preferences.get("wpm", self.default_wpm)
        complexity = user_preferences.get("complexity", "medium")
        
        chunks = self.chunk_text(text, complexity)
        
        return {
            "chunks": chunks,
            "wpm": wpm,
            "total_words": len(text.split()),
            "estimated_duration_minutes": len(text.split()) / wpm,
            "chunk_count": len(chunks)
        }


# Global instance
reader_agent = ReaderAgent()
