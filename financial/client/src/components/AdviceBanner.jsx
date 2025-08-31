import { Lightbulb } from 'lucide-react';

const AdviceBanner = ({ advice }) => {
  if (!advice) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg" role="alert">
      <div className="flex items-center">
        <Lightbulb className="h-6 w-6 mr-3 text-yellow-600" />
        <div>
          <p className="font-bold">FinVoice Advisor</p>
          <p>{advice}</p>
        </div>
      </div>
    </div>
  );
};

export default AdviceBanner;