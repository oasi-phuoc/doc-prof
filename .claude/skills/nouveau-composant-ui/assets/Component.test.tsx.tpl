import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe"; // ou jest-axe, selon la configuration du projet
import { describe, expect, it, vi } from "vitest";
import { __Name__ } from "./__Name__";

describe("__Name__", () => {
  it("s'affiche avec son libellé", () => {
    render(<__Name__>Créer une fiche</__Name__>);
    expect(screen.getByRole("button", { name: "Créer une fiche" })).toBeInTheDocument();
  });

  it("se déclenche au clavier", async () => {
    const onClick = vi.fn();
    render(<__Name__ onClick={onClick}>Imprimer</__Name__>);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ne se déclenche pas quand il est désactivé", async () => {
    const onClick = vi.fn();
    render(<__Name__ disabled onClick={onClick}>Imprimer</__Name__>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("n'a aucune violation d'accessibilité", async () => {
    const { container } = render(<__Name__>Créer une fiche</__Name__>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
