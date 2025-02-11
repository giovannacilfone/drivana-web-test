import styled from "styled-components";

export type Status = "pending" | "approved" | "rejected";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadgeContainer = styled.div<StatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${(props) =>
    props.status === "approved" ? "#4CAF50" : props.status === "rejected" ? "#F44336" : "#FFC107"};
  width: 80px;
  margin-top: 10px;
`;

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusText =
    status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Pending";

  return <StatusBadgeContainer status={status}>{statusText}</StatusBadgeContainer>;
};

export default StatusBadge;
