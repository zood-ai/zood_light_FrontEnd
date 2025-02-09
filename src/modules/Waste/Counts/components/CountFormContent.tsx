import CountTypeFrom from "./CountTypeFrom";
import ItemsList from "./ItemsList";
import SingleItem from "./SingleItem";
import { ICountFormContent } from "../types/types";

const CountFormContent = ({
  step,
  setStep,
  setSelectedItemIndex,
  fromReport,
  formControl,
  countId,
  itemsData,
  isFetchingItems,
  selectedItemIndex,
  nextStep,
  isEdit,
  handleCloseSheet,
  businessDate,
  setOpenReport,
  setGetReport,
  getReport,
  setCountId,
  setIsFirst,
}: ICountFormContent) => {
  const renderCountContent = () => {
    switch (step) {
      case 1:
        return (
          <CountTypeFrom
            control={formControl}
            nextStep={nextStep}
            isEdit={isEdit}
            businessDate={businessDate}
            fromReport={fromReport}
            countId={countId}
            handleCloseSheet={handleCloseSheet}
            setOpenReport={setOpenReport}
            setGetReport={setGetReport}
          />
        );
      case 2:
        return (
          <ItemsList
            setSteps={setStep}
            itemsData={itemsData}
            isFetchingItems={isFetchingItems}
            setSelectedItemIndex={setSelectedItemIndex}
            countId={countId}
            handleCloseSheet={handleCloseSheet}
            setOpenReport={setOpenReport}
            setGetReport={setGetReport}
            getReport={getReport}
            setCountId={setCountId}
            setIsFirst={setIsFirst}
            fromReport={fromReport}
            isEdit={isEdit}
          />
        );

      default:
        return (
          <SingleItem
            selectedItemIndex={selectedItemIndex}
            setSelectedItemIndex={setSelectedItemIndex}
            itemsCount={itemsData?.length}
            itemStorageAreas={itemsData[selectedItemIndex]?.storage_areas}
            stockCounts={itemsData[selectedItemIndex]?.stock_counts}
            basicUnit={itemsData[selectedItemIndex]?.stock_counts[0]?.unit}
          />
        );
    }
  };

  return renderCountContent();
};

export default CountFormContent;
