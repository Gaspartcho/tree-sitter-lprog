package tree_sitter_lprog_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lprog "github.com/gaspartcho/tree-sitter-lprog/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lprog.Language())
	if language == nil {
		t.Errorf("Error loading Lambda Prog grammar")
	}
}
