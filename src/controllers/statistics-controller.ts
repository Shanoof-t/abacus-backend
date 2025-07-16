import {
  createSummary,
  fetchFinancialHistory,
} from "../services/statistics-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const financialSummary = asyncErrorHandler(async (req, res) => {
  const { user, body } = req;

  const stati = await createSummary(body, user);
  res.status(200).json({
    status: "success",
    message: "Successfully fetched money statistics",
    data: stati,
  });
});

export const serialFinincialSummary = asyncErrorHandler(async (req, res) => {
  const { user, body } = req;

  const history = await fetchFinancialHistory({ user, body });

  res.status(200).json({
    status: "success",
    message: "history fetch success",
    data: history,
  });
});
