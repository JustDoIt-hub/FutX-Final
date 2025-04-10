import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommentaryItem {
  minute: number;
  text: string;
}

interface MatchCommentaryProps {
  commentary: CommentaryItem[];
}

const MatchCommentary = ({ commentary }: MatchCommentaryProps) => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 mb-8">
      <h3 className="text-xl font-bold mb-4 text-white">Live Commentary</h3>
      
      <ScrollArea className="h-40 rounded-md border border-gray-700 p-3 bg-gray-900">
        {commentary && commentary.length > 0 ? (
          <AnimatePresence>
            {commentary.map((item, index) => (
              <motion.div 
                key={`${item.minute}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="commentary-item mb-2"
              >
                <div className="text-xs text-gray-400">{item.minute}'</div>
                <div className="commentary-text text-sm text-white">
                  {item.text.includes("GOAL!") ? (
                    <span>
                      <span className="text-yellow-400 font-bold">GOAL! </span>
                      {item.text.replace("GOAL! ", "")}
                    </span>
                  ) : (
                    item.text
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-10 text-gray-400">
            Match commentary will appear here once the game begins...
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MatchCommentary;
