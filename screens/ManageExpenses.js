import { useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/IconButton";
import { GlobalStyles } from "../constants/style";

import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ExpenseForm";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorOverlay from "../components/ErrorOverlay";

export default function ManageExpenses({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContext);
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const edetedExpenseId = route.params?.expenseId;
  const isEditing = !!edetedExpenseId;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpressHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(edetedExpenseId);
      expensesCtx.deleteExpense(edetedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - please try again later!");
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === edetedExpenseId
  );

  async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        expensesCtx.updateExpense(edetedExpenseId, expenseData);
        await updateExpense(edetedExpenseId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        expensesCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later!");
      setIsSubmitting(false);
    }
  }

  function errorHandler() {
    setError(null);
  }

  if (error && !isSubmiting) {
    return <ErrorOverlay onConfirm={errorHandler} message={error} />;
  }

  if (isSubmiting) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        defaultValue={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPressFnc={deleteExpressHandler}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
