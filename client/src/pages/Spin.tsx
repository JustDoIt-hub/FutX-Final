import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSpin } from "@/hooks/useSpin";
import { Button } from "@/components/ui/button";
import SpinWheel from "@/components/SpinWheel";
import SpinResult from "@/components/SpinResult";
import RecentSpins from "@/components/RecentSpins";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { FaSync, FaCheck, FaFutbol } from "react-icons/fa";

const Spin = () => {
  const { user } = useAuth();
  const { 
    spinOptions, 
    recentSpins, 
    spinResult, 
    isSpinning, 
    spinningType,
    isLoading, 
    spin, 
    resetSpinResult 
  } = useSpin();
  
  const [positionDone, setPositionDone] = useState(false);
  const [eventDone, setEventDone] = useState(false);
  const [ovrDone, setOvrDone] = useState(false);
  const [localPositionResult, setLocalPositionResult] = useState<string | null>(null);
  const [localEventResult, setLocalEventResult] = useState<string | null>(null);
  const [localOvrResult, setLocalOvrResult] = useState<string | null>(null);

  // Update the local state based on spinResult
  useEffect(() => {
    if (spinResult) {
      if (spinResult.positionResult) {
        setLocalPositionResult(spinResult.positionResult);
        setPositionDone(true);
      }
      if (spinResult.eventResult) {
        setLocalEventResult(spinResult.eventResult);
        setEventDone(true);
      }
      if (spinResult.ovrResult) {
        setLocalOvrResult(spinResult.ovrResult);
        setOvrDone(true);
      }
    }
  }, [spinResult]);

  // Handle individual wheel spins
  const handlePositionSpin = () => {
    spin('position');
  };

  const handleEventSpin = () => {
    spin('event');
  };

  const handleOvrSpin = () => {
    spin('ovr');
  };

  // Handle spin all
  const handleSpinAll = () => {
    spin('all');
  };

  // Complete the individual spins and get a player
  const handleCompleteSpins = () => {
    // Reset the spinResult first to clear any previous results
    resetSpinResult();
    
    // Then trigger a new 'all' spin with our stored values
    spin('all');
  };

  // Reset everything for a new spin
  const handleResetSpin = () => {
    resetSpinResult();
    setPositionDone(false);
    setEventDone(false);
    setOvrDone(false);
    setLocalPositionResult(null);
    setLocalEventResult(null);
    setLocalOvrResult(null);
  };

  // Check if all three spins are complete
  const allSpinsComplete = positionDone && eventDone && ovrDone;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4 text-white">Loading spin options...</p>
      </div>
    );
  }

  // Check if all spinOptions are available
  if (!spinOptions?.positions || !spinOptions?.events || !spinOptions?.ovrRanges) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-white">Error loading spin options. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <Navigation activeTab="spin" />
      
      <section className="py-8 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            className="w-full md:w-2/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <FaSync className="text-yellow-400 mr-3" /> SPIN THE WHEEL
            </h2>
            
            {/* Show spin wheels or result */}
            {spinResult?.player ? (
              <SpinResult result={spinResult} onReset={handleResetSpin} />
            ) : (
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Position Spinner */}
                  <SpinWheel
                    title="POSITION"
                    options={spinOptions.positions}
                    onSpin={handlePositionSpin}
                    isSpinning={isSpinning && spinningType === 'position'}
                    result={localPositionResult}
                  />
                  
                  {/* Event Spinner */}
                  <SpinWheel
                    title="EVENT"
                    options={spinOptions.events}
                    onSpin={handleEventSpin}
                    isSpinning={isSpinning && spinningType === 'event'}
                    result={localEventResult}
                  />
                  
                  {/* OVR Spinner */}
                  <SpinWheel
                    title="OVR"
                    options={spinOptions.ovrRanges}
                    onSpin={handleOvrSpin}
                    isSpinning={isSpinning && spinningType === 'ovr'}
                    result={localOvrResult}
                  />
                </div>
                
                <div className="mt-6 text-center space-y-4">
                  {allSpinsComplete ? (
                    <div className="space-y-4">
                      <div className="bg-blue-600/20 rounded-lg py-3 px-4">
                        <h3 className="text-lg font-bold text-white mb-2">Spin Results:</h3>
                        <div className="flex justify-center gap-6 text-white">
                          <div className="bg-blue-500/40 px-3 py-2 rounded">
                            <span className="font-bold">Position:</span> {localPositionResult}
                          </div>
                          <div className="bg-blue-500/40 px-3 py-2 rounded">
                            <span className="font-bold">Event:</span> {localEventResult}
                          </div>
                          <div className="bg-blue-500/40 px-3 py-2 rounded">
                            <span className="font-bold">OVR:</span> {localOvrResult}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleCompleteSpins}
                        disabled={isSpinning}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSpinning ? (
                          <>
                            <FaSync className="animate-spin mr-2" /> SEARCHING PLAYER...
                          </>
                        ) : (
                          <>
                            <FaFutbol className="mr-2" /> GET PLAYER
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleResetSpin}
                        variant="outline"
                        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 font-medium ml-4"
                      >
                        RESET & SPIN AGAIN
                      </Button>
                    </div>
                  ) : (
                    <Button
                      id="spinAllBtn"
                      onClick={handleSpinAll}
                      disabled={isSpinning}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSpinning && spinningType === 'all' ? (
                        <>
                          <FaSync className="animate-spin mr-2" /> SPINNING...
                        </>
                      ) : (
                        'SPIN ALL'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Recent Spins */}
          <motion.div 
            className="w-full md:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <RecentSpins recentSpins={recentSpins || []} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Spin;
