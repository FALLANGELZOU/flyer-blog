/**
 * Common
 */
export type ICompareFunction<T> = (a: T, b: T) => number;
export type IDiffFunction<T> = (a: T, b: T) => number;
export function defaultCompare<T>(a: T, b: T): number {
    if (a === b) {
        return Compare.EQUALS;
    } else if (a > b) {
        return Compare.BIGGER_THAN;
    } else {
        return Compare.LESS_THAN;
    }
}
export enum Compare {
    LESS_THAN = -1,
    BIGGER_THAN = 1,
    EQUALS = 0
}



/**
 * Heap
 */
export class Heap<T> {
    private heap: T[] = [];
    private compare: (a: T, b: T) => number;
    constructor(compare: (a: T, b: T) => number) {
      this.compare = compare;
    }
    public push(item: T): void {
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    }
    public pop(): T | undefined {
      if (this.heap.length === 0) {
        return undefined;
      }
      const root = this.heap[0];
      const last = this.heap.pop();
      if (this.heap.length > 0 && last !== undefined) {
        this.heap[0] = last;
        this.sinkDown(0);
      }
      return root;
    }
    public size(): number {
      return this.heap.length;
    }
    private bubbleUp(index: number): void {
      const item = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index + 1) / 2) - 1;
        const parent = this.heap[parentIndex];
        if (this.compare(item, parent) >= 0) {
          break;
        }
        this.heap[parentIndex] = item;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }
    private sinkDown(index: number): void {
      const item = this.heap[index];
      const length = this.heap.length;
      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let leftChild: T | undefined = undefined, rightChild: T | undefined = undefined;
        let swapIndex = -1;
        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (this.compare(leftChild, item) < 0) {
            swapIndex = leftChildIndex;
          }
        }
        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if ((swapIndex === -1 && this.compare(rightChild, item) < 0)) {
            swapIndex = rightChildIndex;
          }
          if (leftChild && swapIndex !== -1 && this.compare(rightChild, leftChild) < 0) {
            swapIndex = rightChildIndex
          }
        }
        if (swapIndex === -1) {
          break;
        }
        this.heap[index] = this.heap[swapIndex];
        this.heap[swapIndex] = item;
        index = swapIndex;
      }
    }
}


/**
 * BinarySearchTree
 */

interface callbackFn<T> {
    (val: T): void;
}

/**
 * 二叉搜索树的实现
 */
export class BinarySearchTree<T> {
    protected root: Node<T> | undefined;

    constructor(protected compareFn: ICompareFunction<T> = defaultCompare) {
        this.root = undefined;
    }

    clear() {
        this.root = undefined
    }

    insert(key: T): void {
        if (this.root == null || this.root == undefined) {
            // 如果根节点不存在则直接新建一个节点
            this.root = new Node(key);
        } else {
            // 在根节点中找合适的位置插入子节点
            this.insertNode(this.root, key);
        }
    }

    // 节点插入
    protected insertNode(node: Node<T>, key: T): void {
        // 新节点的键小于当前节点的键，则将新节点插入当前节点的左边
        // 新节点的键大于当前节点的键，则将新节点插入当前节点的右边
        if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
            if (node.left == null) {
                // 当前节点的左子树为null直接插入
                node.left = new Node(key, node);
            } else {
                // 从当前节点(左子树)向下递归,找到null位置将其插入
                this.insertNode(node.left, key);
            }
        } else {
            if (node.right == null) {
                // 当前节点的右子树为null直接插入
                node.right = new Node(key, node);
            } else {
                // 从当前节点(右子树)向下递归，找到null位置将其插入
                this.insertNode(node.right, key);
            }
        }
    }

    // 中序遍历
    inOrderTraverse(callback: callbackFn<T>): void {
        this.inOrderTraverseNode(<Node<T>>this.root, callback);
    }

    // 按顺序遍历节点
    private inOrderTraverseNode(node: Node<T>, callback: callbackFn<T>) {
        if (node != null) {
            this.inOrderTraverseNode(<Node<T>>node.left, callback);
            callback(node.key);
            this.inOrderTraverseNode(<Node<T>>node.right, callback);
        }
    }

    // 先序遍历
    preOrderTraverse(callback: callbackFn<T>): void {
        this.preOrderTraverseNode(<Node<T>>this.root, callback);
    }

    // 先序遍历结点
    private preOrderTraverseNode(node: Node<T>, callback: callbackFn<T>): void {
        if (node != null) {
            callback(node.key);
            this.preOrderTraverseNode(<Node<T>>node.left, callback);
            this.preOrderTraverseNode(<Node<T>>node.right, callback);
        }
    }

    // 后序遍历
    postOrderTraverse(callback: callbackFn<T>): void {
        this.postOrderTraverseNode(<Node<T>>this.root, callback);
    }

    // 后序遍历节点
    private postOrderTraverseNode(node: Node<T>, callback: callbackFn<T>): void {
        if (node != null) {
            this.postOrderTraverseNode(<Node<T>>node.left, callback);
            this.postOrderTraverseNode(<Node<T>>node.right, callback);
            callback(node.key);
        }
    }

    // 获取最小值
    min(): Node<T> {
        return this.minNode(<Node<T>>this.root);
    }

    // 树的最小节点
    protected minNode(node: Node<T>): Node<T> {
        let current = node;
        while (current != null && current.left != null) {
            current = current.left;
        }
        return current;
    }

    // 获取最大值
    max(): Node<T> {
        return this.maxNode(<Node<T>>this.root);
    }

    // 树的最大节点
    private maxNode(node: Node<T>) {
        let current = node;
        while (current != null && current.right != null) {
            current = current.right;
        }
        return current;
    }

    // 搜索特定值
    search(key: T): boolean | Node<T> {
        return this.searchNode(<Node<T>>this.root, key);
    }

    // 搜索节点
    private searchNode(node: Node<T>, key: T): boolean | Node<T> {
        if (node == null) {
            return false;
        }

        if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
            // 要查找的key在节点的左侧
            return this.searchNode(<Node<T>>node.left, key);
        } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
            // 要查找的key在节点的右侧
            return this.searchNode(<Node<T>>node.right, key);
        } else {
            // 节点已找到
            return node;
        }
    }

    //  搜索大于等于key的节点
    upper(key: T) {
        return this.upperNode(<Node<T>>this.root, key)
    }

    //  搜索小于等于key的节点
    lower(key: T) {
        return this.lowerNode(<Node<T>>this.root, key)
    }

    protected upperNode(node: Node<T>, key: T): Node<T> | null {
        if (node == null) return null
        if (this,this.compareFn(key, node.key) === Compare.LESS_THAN) {
            return this.upperNode(<Node<T>>node.left, key) || node;
        } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
            return this.upperNode(<Node<T>>node.right, key);
        } else {
            return node
        }
    }

    protected lowerNode(node: Node<T>, key: T): Node<T> | null {
        if (node == null) return node
        if (this,this.compareFn(key, node.key) === Compare.LESS_THAN) {
            return this.lowerNode(<Node<T>>node.left, key);
        } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
            return this.lowerNode(<Node<T>>node.right, key) || node;
        } else {
            return node
        }
    }

    // 删除节点函数
    remove(key: T): void {
        this.removeNode(<Node<T>>this.root, key);
    }

    // 删除节点
    protected removeNode(node: Node<T> | null, key: T): null | Node<T> {
        // 正在检测的节点为null，即键不存在于树中
        if (node == null) {
            return null;
        }

        // 不为null,需要在树中找到要移除的键
        if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
            // 目标key小于当前节点的值则沿着树的左边找
            node.left = <Node<T>>this.removeNode(<Node<T>>node.left, key);
            return node;
        } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
            // 目标key大于当前节点的值则沿着树的右边找
            node.right = <Node<T>>this.removeNode(<Node<T>>node.right, key);
            return node;
        } else {
            // 键等于key,需要处理三种情况
            if (node.left == null && node.right == null) {
                // 移除一个叶节点,即该节点没有左、右子节点
                // 将节点指向null来移除它
                node = null;
                return node;
            }

            if (node.left == null) {
                // 移除一个左侧子节点的节点
                // node有一个右侧子节点，因此需要把对它的引用改为对它右侧子节点的引用
                node = <Node<T>>node.right;
                // 返回更新后的节点
                return node;
            } else if (node.right == null) {
                // 移除一个右侧子节点的节点
                // node有一个左侧子节点，因此需要把对它的引用改为对它左侧子节点的引用
                node = node.left;
                // 返回更新后的节点
                return node;
            }

            // 移除有两个子节点的节点
            const aux = this.minNode(node.right); // 当找到了要移除的节点后,需要找到它右边子树最小的节点,即它的继承者
            node.key = aux.key; // 用右侧子树最小的节点的键去更新node的键
            // 更新完node的键后，树中存在了两个相同的键，因此需要移除多余的键
            node.right = <Node<T>>this.removeNode(node.right, aux.key); // 移除右侧子树中的最小节点
            return node; // 返回更新后的节点
        }
    }
}



/**
 * AVL
 */
export class Node<K> {
    public left: Node<K> | undefined;
    public right: Node<K> | undefined;
    public parent: Node<K> | undefined;
    constructor(public key: K, parent?: Node<K>) {
        this.left = undefined;
        this.right = undefined;
        this.parent = parent;
    }

    toString(): string {
        return `${this.key}`;
    }
}

// 平衡因子的值
enum BalanceFactor {
    UNBALANCED_RIGHT = 1,
    SLIGHTLY_UNBALANCED_RIGHT = 2,
    BALANCED = 3,
    SLIGHTLY_UNBALANCED_LEFT = 4,
    UNBALANCED_LEFT = 5
}

export class AVLTree<T> extends BinarySearchTree<T> {
    constructor(protected compareFn: ICompareFunction<T> = defaultCompare) {
        super(compareFn);
    }

    // 计算节点高度
    private getNodeHeight(node: Node<T>): number {
        if (node == null) {
            return -1;
        }
        return Math.max(this.getNodeHeight(<Node<T>>node.left), this.getNodeHeight(<Node<T>>node.right)) + 1;
    }

    // 计算节点的平衡因子:在AVL树中，需要对每个节点计算右子树的高度和左子树的高度的差值，该值应为0 | -1 | 1，如果差值不符合要求则需要平衡该树。
    private getBalanceFactor(node: Node<T>) {
        // 计算差值
        const heightDifference = this.getNodeHeight(<Node<T>>node.left) - this.getNodeHeight(<Node<T>>node.right);
        switch (heightDifference) {
            case -2:
                return BalanceFactor.UNBALANCED_RIGHT;
            case -1:
                return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT;
            case 1:
                return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT;
            case 2:
                return BalanceFactor.UNBALANCED_LEFT;
            default:
                return BalanceFactor.BALANCED;
        }
    }

    /**
     * 左左情况: 向右的单旋转
     *
     *      b                            a
     *     / \                          / \
     *    a   e -> rotationLL(b) ->    c   b
     *   / \                              / \
     *  c   d                            d   e
     *
     * @param node
     */
    private rotationLL(node: Node<T>) {
        // 创建tmp变量, 存储node的左子节点
        const tmp = <Node<T>>node.left;
        // node的左子节点修改为tmp的右子节点
        node.left = tmp.right;
        // tmp的右子节点修改为node
        tmp.right = node;
        // 更新节点
        return tmp;
    }

    /**
     * 右右情况: 向左的单旋转
     *
     *      a                            b
     *     / \                          / \
     *    c   b -> rotationRR(a) ->    a   e
     *       / \                      / \
     *      d   e                    c   d
     * @param node
     */
    private rotationRR(node: Node<T>) {
        // 将节点X置于节点Y
        const tmp = <Node<T>>node.right;
        // 将Y的右子节点置为X的左子节点
        node.right = tmp.left;
        // 将X的左子节点置为Y
        tmp.left = node;
        // 更新节点
        return tmp;
    }

    /**
     * 左右情况: 向右的双旋转, 先向右旋转然后向左旋转
     * @param node
     */
    private rotationLR(node: Node<T>) {
        node.left = this.rotationRR(<Node<T>>node.left);
        return this.rotationLL(node);
    }

    /**
     * 右左情况: 向左的双旋转,先向左旋转然后向右旋转
     * @param node
     */
    private rotationRL(node: Node<T>) {
        node.right = this.rotationLL(<Node<T>>node.right);
        return this.rotationRR(node);
    }

    // 向树AVL树中插入节点
    insert(key: T) {
        this.root = this.insertNode(<Node<T>>this.root, key);
    }

    protected insertNode(node: Node<T>, key: T) {
        if (node == null) {
            return new Node(key);
        } else if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
            node.left = this.insertNode(<Node<T>>node.left, key);
        } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
            node.right = this.insertNode(<Node<T>>node.right, key);
        } else {
            return node; // 重复的键
        }

        // 计算平衡因子判断树是否需要平衡操作
        const balanceState = this.getBalanceFactor(node);

        // 向左侧子树插入节点后树失衡
        if (balanceState === BalanceFactor.UNBALANCED_LEFT) {
            // 判断插入的键是否小于左侧子节点的键
            if (this.compareFn(key, <T>node.left?.key) === Compare.LESS_THAN) {
                // 小于则进行LL旋转
                node = this.rotationLL(node);
            } else {
                // 否则进行LR旋转
                return this.rotationLR(node);
            }
        }
        // 向右侧子树插入节点后树失衡
        if (balanceState === BalanceFactor.UNBALANCED_RIGHT) {
            // 判断插入的键是否小于右侧子节点的键
            if (this.compareFn(key, <T>node.right?.key) === Compare.BIGGER_THAN) {
                // 小于则进行RR旋转
                node = this.rotationRR(node);
            } else {
                // 否则进行RL旋转
                return this.rotationRL(node);
            }
        }
        // 更新节点
        return node;
    }

    // 移除节点
    protected removeNode(node: Node<T>, key: T) {
        node = <Node<T>>super.removeNode(node, key);
        if (node == null) {
            return node;
        }

        // 获取树的平衡因子
        const balanceState = this.getBalanceFactor(node);
        // 左树失衡
        if (balanceState === BalanceFactor.UNBALANCED_LEFT) {
            // 计算左树的平衡因子
            const balanceFactorLeft = this.getBalanceFactor(<Node<T>>node.left);
            // 左侧子树向左不平衡
            if (balanceFactorLeft === BalanceFactor.BALANCED || balanceFactorLeft === BalanceFactor.UNBALANCED_LEFT) {
                // 进行LL旋转
                return this.rotationLL(node);
            }
            // 右侧子树向右不平衡
            if (balanceFactorLeft === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
                // 进行LR旋转
                return this.rotationLR(<Node<T>>node.left);
            }
        }
        // 右树失衡
        if (balanceState === BalanceFactor.UNBALANCED_RIGHT) {
            // 计算右侧子树平衡因子
            const balanceFactorRight = this.getBalanceFactor(<Node<T>>node.right);
            // 右侧子树向右不平衡
            if (balanceFactorRight === BalanceFactor.BALANCED || balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
                // 进行RR旋转
                return this.rotationRR(node);
            }
            // 右侧子树向左不平衡
            if (balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
                // 进行RL旋转
                return this.rotationRL(<Node<T>>node.right);
            }
        }
        return node;
    }
}

