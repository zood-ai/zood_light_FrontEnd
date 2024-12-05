
import ShiftTypeSection from './components/ShiftTypes/ShiftTypeSection';
import OverTimeSection from './components/OvertimeRules/OverTimeSection';
import ClockingRulesSection from './components/ClockingRules/ClockingRulesSection';

const Labour = () => {



    return (
        <div className="ml-[241px] w-[645px] flex flex-col gap-8 ">
            <h2 className="font-bold text-[20px] mb-4">Labour settings</h2>
            {/*------------------------------------------------ Shift types -----------------------------------------------------*/}
            <ShiftTypeSection />

            {/*------------------------------------------------ Overtime rules -----------------------------------------------------*/}

            <OverTimeSection />
            {/*------------------------------------------------ Overtime rules -----------------------------------------------------*/}
            <ClockingRulesSection />

        </div>
    );
};

export default Labour;
