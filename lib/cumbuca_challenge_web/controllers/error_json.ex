defmodule CumbucaChallengeWeb.ErrorJSON do
  @moduledoc """
  This module is invoked by your endpoint in case of errors on JSON requests.

  See config/config.exs.
  """

  # If you want to customize a particular status code,
  # you may add your own clauses, such as:
  #
  # def render("500.json", _assigns) do
  #   %{errors: %{detail: "Internal Server Error"}}
  # end

  # By default, Phoenix returns the status message from
  # the template name. For example, "404.json" becomes
  # "Not Found".
  def render(template, _assigns) do
    %{errors: %{detail: Phoenix.Controller.status_message_from_template(template)}}
  end

  def error(%{errors: :deadlock}) do
    %{
      message: "A deadlock occurred while processing your request. Please try again."
    }
  end

  def error(%{errors: :not_found}) do
    %{
      message: "Data not found"
    }
  end

  def error(%{errors: :unauthorized}) do
    %{
      message: "Invalid authentication"
    }
  end

  def error(%{errors: :bad_request}) do
    %{
      message: "Invalid request"
    }
  end

  def error(%{errors: changeset}) do
    %{
      message: "Invalid params",
      errors: Ecto.Changeset.traverse_errors(changeset, &translate_errors/1)
    }
  end

  defp translate_errors({msg, opts}) do
    Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
      opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
    end)
  end
end
