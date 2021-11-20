import React, { useState, useEffect } from "react";
import { Button, Typography } from "antd";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";

const { Title, Text } = Typography;

const rootUrl = getRootUrl();

function TotalOweAmount(): JSX.Element {
  const [totalOweAmountList, setTotalOweAmountList] = useState([]);
  const [totalOweAmount, setTotalOweAmount] = useState(0);
  const [showTotalOweAmountListView, setShowTotalOweAmountListView] =
    useState(false);

  useEffect(() => {
    getTotalOweAmount();
  }, []);

  const getTotalOweAmount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(
          `${rootUrl}/overall/get-total-owe-amount`,
          {
            params: {
              user_id: userId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (responseData && responseData.total_owe_amount_list) {
            setTotalOweAmountList(responseData.total_owe_amount_list);
            setTotalOweAmount(responseData.total_owe_amount);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const renderTotalOweAmountList = (totalOweAmountList: any[]) => {
    let totalOweAmountListView = null;

    if (totalOweAmountList) {
      totalOweAmountListView = totalOweAmountList.map(
        (item: any, i: number) => {
          return (
            <div key={i}>
              <Text>
                ${item.owe_amount} - {item.currency_name} ({item.currency_code})
              </Text>
            </div>
          );
        }
      );
    }

    return (
      <div className="mx-5 my-3">
        <div className="d-flex flex-row">
          <div className="my-1">
            <Title level={5}>Overall, you owe ${totalOweAmount}</Title>
          </div>
          <Button
            className="mx-2"
            type="default"
            htmlType="submit"
            onClick={handleShowTotalOweAmountListView}
          >
            Show total owe amount details
          </Button>
        </div>
        {showTotalOweAmountListView ? totalOweAmountListView : null}
      </div>
    );
  };

  const handleShowTotalOweAmountListView = () => {
    if (!showTotalOweAmountListView) {
      setShowTotalOweAmountListView(true);
    } else {
      setShowTotalOweAmountListView(false);
    }
  };

  return renderTotalOweAmountList(totalOweAmountList);
}

export default TotalOweAmount;
