#pragma once
#include <stdlib.h>
#include <cmath>
#include <vector>

struct Node {
	float x, y;
	// This var "key" is contained a angle value and the list will be sorted by it
	float key;
	struct Node *left, *right;
};

class BinaryTree {
public:
	BinaryTree() : root(nullptr), iSize(0u) {}

	~BinaryTree() {
		RemoveAllNode(&root);
	}

	void Insert(float x, float y, float key) {
		InsertNode(&root, x, y, key);
	}

	void RemoveAll() {
		RemoveAllNode(&root);
	}

	Node* GetRoot() {
		return root;
	}

	std::vector<Node *> GetVector() {
		std::vector<Node *> vTree, vStack;
		Node *curr = root;

		while (curr != nullptr || vStack.empty() == false) {
			while (curr != nullptr) {
				vStack.push_back(curr);
				curr = curr->left;
			}

			curr = vStack.back();
			vTree.push_back(curr);
			vStack.pop_back();
			
			curr = curr->right;
		}

		return vTree;
	}


	unsigned int GetSize() {
		return iSize;
	}

private:
	void InsertLeaf(Node **ptr, float x, float y, float key) {
		Node* next = (Node *)malloc(sizeof(Node));
		if (next == nullptr)
			return;

		next->x = x; next->y = y; next->key = key;
		next->left = nullptr; next->right = nullptr;
		*ptr = next;
		iSize++;
	}

	void InsertLeaf(Node **ptr, Node **node) {
		*ptr = *node;
		iSize++;
	}

	void InsertNode(Node **ptr, float x, float y, float key) {
		Node* a = *ptr;
		if (a == nullptr)
			return InsertLeaf(ptr, x, y, key);
		// Check on a small difference between a->key and key,
		// instead of directly check on equality 
		if (fabs(a->key - key) < 0.0001f)
			return;
		if (a->key > key)
			return InsertNode(&a->left, x, y, key);
		if (a->key < key)
			return InsertNode(&a->right, x, y, key);
	}

	void InsertNode(Node** ptr, Node** node) {
		Node* a = *ptr;
		if (a == nullptr)
			return InsertLeaf(ptr, node);
		if (a->key == (*node)->key)
			return;
		if (a->key > (*node)->key)
			return InsertNode(&a->left, node);
		if (a->key < (*node)->key)
			return InsertNode(&a->right, node);
	}

	void RemoveNode(Node **ptr) {
		Node* a = *ptr;
		if (a->left != nullptr)
			*ptr = a->left;
		if (a->right != nullptr) {
			if (a->left != nullptr) {
				if (a->left->right != nullptr) {
					InsertNode(&root, &a->right);
					iSize--;
				}
				else {
					(*ptr)->right = a->right;
				}
			}
			else {
				*ptr = a->right;
			}
		}

		if (a->left == nullptr && a->right == nullptr)
			*ptr = nullptr;

		free(a);
		iSize--;
	}

	void RemoveAllNode(Node **ptr) {
		Node* a = *ptr;
		if (a == nullptr)
			return;

		RemoveAllNode(&a->left);
		RemoveAllNode(&a->right);
		RemoveNode(ptr);
	}

private:
	Node *root;
	unsigned int iSize;
};
