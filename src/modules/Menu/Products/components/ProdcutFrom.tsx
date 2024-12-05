import Modifiers from "./Modifiers";
import ProdcutInfo from "./ProdcutInfo";
import Recipes from "./Recipes";
const ProdcutFrom = ({ isEdit }: { isEdit: boolean }) => {
  return (
    <div className="flex flex-col gap-8">
      <ProdcutInfo />
      {isEdit && <Modifiers />}
      <Recipes />
    </div>
  );
};

export default ProdcutFrom;
