import reducer, {
  fetchLoginAsync,
  clearError,
} from "@/redux/slices/loginSplice";
import { RESPONSE_CODE } from "@/utils/constants";

const initialState: any = {
  isLoading: false,
  data: {},
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
};

describe("loginSlice reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle clearError", () => {
    const errorState = {
      ...initialState,
      error: true,
      code: "ERROR_CODE",
      data: { something: "wrong" },
    };
    expect(reducer(errorState, clearError())).toEqual(initialState);
  });

  it("should handle fetchLoginAsync.pending", () => {
    const nextState = reducer(initialState, {
      type: fetchLoginAsync.pending.type,
    });
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(false);
  });

  it("should handle fetchLoginAsync.fulfilled", () => {
    const action = {
      type: fetchLoginAsync.fulfilled.type,
      payload: {
        data: [{ name: "John" }],
        description: "Login success",
        responseCode: RESPONSE_CODE.SUCCESS,
        status: "ok",
      },
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(action.payload.data);
    expect(state.code).toEqual(RESPONSE_CODE.SUCCESS);
    expect(state.message).toEqual("Login success");
  });

  it("should handle fetchLoginAsync.rejected", () => {
    const action = {
      type: fetchLoginAsync.rejected.type,
      payload: { responseCode: RESPONSE_CODE.ERROR },
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.code).toEqual(RESPONSE_CODE.ERROR);
  });
});
