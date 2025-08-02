import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusChip from "@/components/statusChip";

describe("StatusChip Test cases ",()=>{

const statuses = ["Fulfilled", "Pending", "Cancelled", "Approved", "Rejected"] as const;

// Define the expected styles for each status
const statusStyles: Record<typeof statuses[number], { border: string; background: string; color: string }> = {
  Fulfilled: { border: "1px solid #00426A", background: "#00426A0A", color: "#00426A" },
  Pending: { border: "1px solid #FC8A00", background: "#FFF8F0", color: "#FC8A00" },
  Cancelled: { border: "1px solid #E4002B", background: "#E4002B0A", color: "#E4002B" },
  Approved: { border: "1px solid #008755", background: "#E5FFF6", color: "#008755" },
  Rejected: { border: "1px solid #E4002B", background: "#E4002B0A", color: "#E4002B" },
};

statuses.forEach((status) => {
  it(`renders StatusChip with correct label and styles for ${status}`, () => {
    const { container } = render(<StatusChip status={status} />);
    const chip = screen.getByText(status).closest(".MuiChip-root");

    expect(chip).toBeInTheDocument();
    expect(screen.getByText(status)).toBeVisible();

    // Check style via container or inline
    expect(chip).toHaveStyle(`border: ${statusStyles[status].border}`);
    expect(chip).toHaveStyle(`background: ${statusStyles[status].background}`);
    expect(chip).toHaveStyle(`color: ${statusStyles[status].color}`);
  });
});
it('renders fallback Chip when status is invalid and checks label and styles', () => {
  const { container } = render(<StatusChip status={"Invalid" as any} />);
  // Assert both labels are present
  expect(screen.getByText("Invalid")).toBeInTheDocument();
  expect(screen.getByText("---")).toBeInTheDocument();

  // Optional: check that there are 2 Chip root elements
  const allChips = container.querySelectorAll(".MuiChip-root");
  expect(allChips).toHaveLength(2);

  // Optional: check that the outer chip has correct label
  const mainChipLabel = screen.getByText("Invalid");
  const mainChip = mainChipLabel.closest(".MuiChip-root");
  expect(mainChip).toHaveClass("MuiChip-root");

  // Optional: check that the fallback chip is rendered inside as icon
  const fallbackChip = screen.getByText("---").closest(".MuiChip-root");
  expect(fallbackChip).toHaveClass("MuiChip-root");
});

})


